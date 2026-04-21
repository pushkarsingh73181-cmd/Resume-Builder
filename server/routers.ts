import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  resumes: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserResumes(ctx.user.id)),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) => db.getResumeById(input.id, ctx.user.id)),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          data: z.string(),
          template: z
            .enum(["modern", "classic", "minimal", "creative"])
            .default("modern"),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createResume(ctx.user.id, input.title, input.data, input.template)
      ),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          data: z.string().optional(),
          template: z
            .enum(["modern", "classic", "minimal", "creative"])
            .optional(),
          atsScore: z.number().optional(),
          pdfUrl: z.string().optional(),
          pdfKey: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateResume(id, ctx.user.id, updates);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => db.deleteResume(input.id, ctx.user.id)),
  }),

  subscriptions: router({
    getStatus: protectedProcedure.query(({ ctx }) =>
      db.getOrCreateSubscription(ctx.user.id)
    ),
    update: protectedProcedure
      .input(
        z.object({
          tier: z.enum(["free", "pro"]).optional(),
          stripeCustomerId: z.string().optional(),
          stripeSubscriptionId: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.updateSubscription(ctx.user.id, input)
      ),
  }),

  jobDescriptions: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserJobDescriptions(ctx.user.id)
    ),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) =>
        db.getJobDescriptionById(input.id, ctx.user.id)
      ),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          company: z.string().optional(),
          content: z.string().min(1),
          keywords: z.string().optional(),
          skills: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createJobDescription(
          ctx.user.id,
          input.title,
          input.company,
          input.content,
          input.keywords,
          input.skills
        )
      ),
  }),
});

export type AppRouter = typeof appRouter;
