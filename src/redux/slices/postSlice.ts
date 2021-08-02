import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { Observable } from "rxjs"
import { switchMap, withLatestFrom } from 'rxjs/operators'
import { RootStoreType } from "../rootReducer"
import { MyEpic } from "../store"
import { Post, Comment } from "../../services/network/api/models"

import { ApiService } from "../../services/network/api/apiService"
import { navigationService } from "../../services/navigation/navigationService"

type PostReducer = {
    loading: boolean,
    posts: [Post] | [],
    postID?: number,
    specificPost?: Post,
    comments: [Comment] | []
}

const initialState: PostReducer = {
    loading: false,
    posts: [],
    postID: undefined,
    specificPost: undefined,
    comments: []
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        // get all posts
        getAllPosts: (state) => ({ ...state, loading: true }),
        getAllPostsSuccess: (state, action) => ({
            ...state,
            loading: false,
            posts: action.payload
        }),
        getAllPostsError: (state) => ({ ...state, loading: false, }),

        // get specifc post
        getPost: (state, action) => ({
            ...state,
            loading: true,
            postID: action.payload
        }),
        getPostSuccess: (state, action) => ({
            ...state,
            loading: false,
            specificPost: action.payload
        }),
        getPostError: (state) => ({ ...state, loading: false }),

        // get comments
        getComments: (state, action) => ({
            ...state,
            loading: true,
            postID: action.payload
        }),
        getCommentsSuccess: (state, action) => ({
            ...state,
            loading: false,
            comments: action.payload
        }),
        getCommentsError: (state) => ({ ...state, loading: false, }),
    },
})


const getAllPostsEpic: MyEpic = (action$: Observable<PayloadAction<undefined>>, state$: Observable<RootStoreType>) =>
    action$.pipe(
        ofType(postActions.getAllPosts.type),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            return ApiService.api.getAllPosts()
                .then(result => {
                    return postActions.getAllPostsSuccess(result)
                })
                .catch(error => {
                    return postActions.getAllPostsError()
                })
        })
    )

const getPostEpic: MyEpic = (action$: Observable<PayloadAction<undefined>>, state$: Observable<RootStoreType>) =>
    action$.pipe(
        ofType(postActions.getPost.type),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const { postID } = state.post

            return ApiService.api.getPost(postID!)
                .then(result => {
                    return postActions.getPostSuccess(result)
                })
                .catch(error => {
                    return postActions.getPostError()
                })
        })
    )

const getCommentsEpic: MyEpic = (action$: Observable<PayloadAction<undefined>>, state$: Observable<RootStoreType>) =>
    action$.pipe(
        ofType(postActions.getComments.type),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const { postID } = state.post

            return ApiService.api.getComments(postID!)
                .then(result => {
                    navigationService.navigate('PostContent')
                    return postActions.getCommentsSuccess(result)
                })
                .catch(error => {
                    return postActions.getCommentsError()
                })
        })
    )

export const postReducer = postSlice.reducer
export const postActions = postSlice.actions
export const postEpics = [getAllPostsEpic, getPostEpic, getCommentsEpic]