import express from 'express'
import Stripe from 'stripe'
import { authMiddleware } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

const router = express.Router()

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const getClientOrigin = (req) => req.headers.origin || CLIENT_URL
const isActiveSubscription = (subscription) => ['active', 'trialing'].includes(subscription?.status)
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('placeholder') || secretKey.includes('your_')) return null
  return new Stripe(secretKey)
}

const syncSubscription = async (userId, subscription, customerId) => {
  const isPro = isActiveSubscription(subscription)
  return User.findByIdAndUpdate(userId, {
    isPro,
    plan: isPro ? 'pro' : 'free',
    planStartedAt: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : undefined,
    planExpiresAt: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionCurrentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
    ...(customerId ? { stripeCustomerId: customerId } : {}),
  }, { new: true })
}

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isPro: user.isPro,
  plan: user.plan,
  planStartedAt: user.planStartedAt,
  planExpiresAt: user.planExpiresAt,
  subscriptionStatus: user.subscriptionStatus,
  subscriptionId: user.subscriptionId,
  stripeCustomerId: user.stripeCustomerId,
  razorpayCustomerId: user.razorpayCustomerId,
  resumeCount: user.resumeCount,
})

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const stripe = getStripe()
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in the server environment.' })
    }

    const billingCycle = req.body.billingCycle === 'year' ? 'year' : 'month'
    const priceId = billingCycle === 'year'
      ? process.env.STRIPE_PRICE_ID_PRO_YEAR
      : process.env.STRIPE_PRICE_ID_PRO_MONTH || process.env.STRIPE_PRO_PRICE_ID
    if (!priceId) {
      return res.status(500).json({ error: `STRIPE_PRICE_ID_PRO_${billingCycle.toUpperCase()} is not configured.` })
    }

    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (['active', 'trialing'].includes(user.subscriptionStatus)) {
      return res.status(409).json({ error: 'You already have an active Pro subscription.' })
    }

    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user._id) },
      })
      customerId = customer.id
      user.stripeCustomerId = customerId
      await user.save()
    }

    const origin = getClientOrigin(req)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: String(user._id),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      subscription_data: {
        metadata: { userId: String(user._id) },
      },
      metadata: { userId: String(user._id) },
    })

    res.json({ sessionId: session.id, url: session.url, billingCycle })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const stripe = getStripe()
    if (!stripe) return res.status(500).json({ error: 'Stripe is not configured.' })

    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' })

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })

    const subscription = session.subscription
    if (!subscription) {
      return res.status(400).json({ error: 'Subscription not found' })
    }

    const userId = subscription.metadata?.userId || session.metadata?.userId || session.client_reference_id
    if (!userId || String(userId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'This Checkout Session does not belong to your account.' })
    }
    if (!isActiveSubscription(subscription)) {
      return res.status(400).json({ error: 'Subscription is not active yet.' })
    }

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const customerId = typeof session.customer === 'object' ? session.customer.id : session.customer
    const updatedUser = await syncSubscription(userId, subscription, customerId)

    res.json({ user: formatUser(updatedUser) })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
})

router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const stripe = getStripe()
    if (!stripe) return res.status(500).json({ error: 'Stripe is not configured.' })

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (!user.subscriptionId) return res.status(400).json({ error: 'No active subscription found' })

    const updatedSubscription = await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    })

    const updatedUser = await syncSubscription(user._id, updatedSubscription, user.stripeCustomerId)

    res.json({ user: formatUser(updatedUser), message: 'Subscription will cancel at the end of the period.' })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
})

router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    let lastInvoice = null
    if (user.subscriptionId) {
      const stripe = getStripe()
      if (!stripe) return res.status(500).json({ error: 'Stripe is not configured.' })
      const invoices = await stripe.invoices.list({ subscription: user.subscriptionId, limit: 1 })
      if (invoices.data?.length) {
        const invoice = invoices.data[0]
        lastInvoice = {
          id: invoice.id,
          amountPaid: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          createdAt: invoice.created ? new Date(invoice.created * 1000) : null,
          periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
          periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
        }
      }
    }

    res.json({
      user: formatUser(user),
      lastInvoice,
    })
  } catch (error) {
    console.error('Subscription status error:', error)
    res.status(500).json({ error: 'Failed to load subscription status' })
  }
})

export const subscriptionWebhookHandler = async (req, res) => {
  const stripe = getStripe()
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret || webhookSecret.includes('your_')) {
    console.error('Stripe webhook is not configured')
    return res.status(500).send('Webhook not configured')
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const subscriptionId = session.subscription
        let subscription = null
        if (subscriptionId) {
          subscription = await stripe.subscriptions.retrieve(subscriptionId)
        }
        const userId = (subscription && subscription.metadata?.userId) || session.metadata?.userId || session.client_reference_id
        if (userId && subscription) {
          const customerId = typeof session.customer === 'object' ? session.customer.id : session.customer
          await syncSubscription(userId, subscription, customerId)
        }
        break
      }
      case 'invoice.paid': {
        const invoice = event.data.object
        const subscriptionId = invoice.parent?.subscription_details?.subscription || invoice.subscription
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata?.userId
          if (userId) {
            await syncSubscription(userId, subscription)
          }
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId
        if (userId) {
          await syncSubscription(userId, subscription)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId
        if (userId) {
          await syncSubscription(userId, subscription)
        }
        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (e) {
    console.error('Webhook handler error:', e)
    res.status(500).send('Internal error')
  }
}

export default router
