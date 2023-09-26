import axios from 'axios'
import { returnErrors } from "../../error/error.actions"
import { returnSuccess } from '../../success/success.actions'
import { GET_BLOG_POSTS, GET_BLOG_POSTS_FAIL, GET_ONE_BLOG_POST, GET_ONE_BLOG_POST_FAIL, GET_BLOG_POSTS_BY_CATEGORY, GET_BLOG_POSTS_BY_CATEGORY_FAIL, CREATE_BLOG_POST, CREATE_BLOG_POST_FAIL, DELETE_BLOG_POST, DELETE_BLOG_POST_FAIL, UPDATE_BLOG_POST, UPDATE_BLOG_POST_FAIL, BLOG_POSTS_LOADING, ONE_BLOG_POST_LOADING } from "./blogPosts.types"
import { tokenConfig, uploadConfig } from '../../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? (qbURL || devApiURL) : apiURL,
})

// View all blog posts
export const getBlogPosts = (limit, skip) => async (dispatch, getState) => {
  await dispatch(getBlogPostsLoading())
  console.log(`The qbURL is ${qbURL}`);

  try {
    await axiosInstance
      .get(`/api/blogPosts?limit=${limit}&skip=${skip}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_BLOG_POSTS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_BLOG_POSTS_FAIL'))
    dispatch({ type: GET_BLOG_POSTS_FAIL })
  }
}

// View one blog post at a time
export const getOneBlogPost = (bPSlug) => async (dispatch, getState) => {
  await dispatch(getOneBlogPostsLoading())

  try {
    await axiosInstance
      .get(`/api/blogPosts/${bPSlug}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_BLOG_POST,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ONE_BLOG_POST_FAIL'))
    dispatch({ type: GET_ONE_BLOG_POST_FAIL })
  }
}

// View all courses by course category
export const getBlogPostsByCategory = (bPCatID) => async (dispatch, getState) => {
  await dispatch(getBlogPostsLoading())

  try {
    await axiosInstance
      .get(`/api/blogposts/postCategory/${bPCatID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_BLOG_POSTS_BY_CATEGORY,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_BLOG_POSTS_BY_CATEGORY_FAIL'))
    dispatch({ type: GET_BLOG_POSTS_BY_CATEGORY_FAIL })
  }
}

// Create blog post
export const createBlogPost = (newBlogPost, onUploadProgress) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/blogPosts', newBlogPost, uploadConfig(getState, onUploadProgress))
      .then(res =>
        dispatch({
          type: CREATE_BLOG_POST,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Blog post created! Reloading the page ...', 200, 'CREATE_BLOG_POST'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_BLOG_POST_FAIL'))
    dispatch({ type: CREATE_BLOG_POST_FAIL })
  }
}


// Update a Blog post
export const updateBlogPost = updatedBP => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/blogPosts/${updatedBP.blogPostID}`, updatedBP, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_BLOG_POST,
          payload: updatedBP
        }))

      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Blog post updated! Reloading the page ...', 200, 'UPDATE_BLOG_POST'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_BLOG_POST_FAIL'))
    dispatch({ type: UPDATE_BLOG_POST_FAIL })
  }
}

// Delete a Blog post
export const deleteBlogPost = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This Blog post will be deleted permanently!")) {
      await axiosInstance.delete(`/api/blogPosts/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_BLOG_POST,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Blog post deleted! Reloading the page ...', 200, 'DELETE_BLOG_POST'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_BLOG_POST_FAIL'))
    dispatch({ type: DELETE_BLOG_POST_FAIL })
  }
}

export const getBlogPostsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: BLOG_POSTS_LOADING
  }
}

export const getOneBlogPostsLoading = () => {
  return {
    type: ONE_BLOG_POST_LOADING
  }
}