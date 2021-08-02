import { combineReducers } from "redux"
import { postReducer } from './slices/postSlice'

export const rootReducer = combineReducers({
  post: postReducer
})

export type RootStoreType = ReturnType<typeof rootReducer>