import { configureStore } from '@reduxjs/toolkit'
import resumeReducer from './resumeSlice'

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
  },
})

export const useAppDispatch = () => {
  const { useDispatch } = require('react-redux')
  return useDispatch()
}

export const useAppSelector = (selector) => {
  const { useSelector } = require('react-redux')
  return useSelector(selector)
}

export default store
