import axios from 'axios'
import { returnErrors } from "../../../error/error.actions"
import { returnSuccess } from '../../../success/success.actions'
import { GET_BLOG_POSTS_VIEWS, GET_BLOG_POSTS_VIEWS_FAIL, GET_ONE_BLOG_POST_VIEW, GET_ONE_BLOG_POST_VIEW_FAIL, CREATE_BLOG_POST_VIEW, CREATE_BLOG_POST_VIEW_FAIL, DELETE_BLOG_POST_VIEW, DELETE_BLOG_POST_VIEW_FAIL, UPDATE_BLOG_POST_VIEW, UPDATE_BLOG_POST_VIEW_FAIL, BLOG_POSTS_VIEWS_LOADING, GET_RECENT_TEN_VIEWS, GET_RECENT_TEN_VIEWS_FAIL } from "./blogPostsViews.types"
import { tokenConfig } from '../../../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../../../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL),
})

// View all blog posts views
export const getBlogPostsViews = (limit, skip) => async (dispatch, getState) => {
  await dispatch(getBlogPostsViewsLoading())
  console.log(`The qbURL is ${qbURL}`);

  try {
    await axiosInstance
      .get(`/api/blogPostsViews?limit=${limit}&skip=${skip}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_BLOG_POSTS_VIEWS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_BLOG_POSTS_VIEWS_FAIL'))
    dispatch({ type: GET_BLOG_POSTS_VIEWS_FAIL })
  }
}

export const getRecentTenViews = () => async (dispatch, getState) => {
  await dispatch(getBlogPostsViewsLoading())

  try {
    await axiosInstance
      .get(`/api/blogPostsViews/recentTen`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_RECENT_TEN_VIEWS,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_RECENT_TEN_VIEWS_FAIL'))
    dispatch({ type: GET_RECENT_TEN_VIEWS_FAIL })
  }
}

// View one blog post at a time
export const getOneBlogPostView = (id) => async (dispatch, getState) => {
  await dispatch(getBlogPostsViewsLoading())

  try {
    await axiosInstance
      .get(`/api/blogPostsViews/${id}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_BLOG_POST_VIEW,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ONE_BLOG_POST_VIEW_FAIL'))
    dispatch({ type: GET_ONE_BLOG_POST_VIEW_FAIL })
  }
}

// Create blog post view
export const createBlogPostView = (newBlogPostView) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/blogPostsViews', newBlogPostView, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_BLOG_POST_VIEW,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Blog post view added!', 200, 'CREATE_BLOG_POST_VIEW'),
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_BLOG_POST_VIEW_FAIL'))
    dispatch({ type: CREATE_BLOG_POST_VIEW_FAIL })
  }
}


// Update a Blog post
export const updateBlogPost = updatedBPV => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/blogPostsViews/${updatedBPV.blogPostViewID}`, updatedBPV, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_BLOG_POST_VIEW,
          payload: updatedBPV
        }))

      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Blog post view updated! Reloading the page ...', 200, 'UPDATE_BLOG_POST_VIEW'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_BLOG_POST_VIEW_FAIL'))
    dispatch({ type: UPDATE_BLOG_POST_VIEW_FAIL })
  }
}

// Delete a Blog post
export const deleteBlogPost = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This blog post view will be deleted permanently!")) {
      await axiosInstance.delete(`/api/blogPostsViews/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_BLOG_POST_VIEW,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Blog post view deleted! Reloading the page ...', 200, 'DELETE_BLOG_POST_VIEW'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_BLOG_POST_VIEW_FAIL'))
    dispatch({ type: DELETE_BLOG_POST_VIEW_FAIL })
  }
}

export const getBlogPostsViewsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: BLOG_POSTS_VIEWS_LOADING

  }
}