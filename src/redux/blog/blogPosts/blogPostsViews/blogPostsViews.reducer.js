import { GET_BLOG_POSTS_VIEWS, GET_BLOG_POSTS_VIEWS_FAIL, GET_ONE_BLOG_POST_VIEW, GET_ONE_BLOG_POST_VIEW_FAIL, GET_BLOG_POSTS_VIEWS_BY_CATEGORY, GET_BLOG_POSTS_VIEWS_BY_CATEGORY_FAIL, CREATE_BLOG_POST_VIEW, CREATE_BLOG_POST_VIEW_FAIL, DELETE_BLOG_POST_VIEW, DELETE_BLOG_POST_VIEW_FAIL, UPDATE_BLOG_POST_VIEW, UPDATE_BLOG_POST_VIEW_FAIL, BLOG_POSTS_VIEWS_LOADING, GET_RECENT_TEN_VIEWS, GET_RECENT_TEN_VIEWS_FAIL } from "./blogPostsViews.types";

const INITIAL_STATE = {
  allBlogPostsViews: [],
  recentTenViews : [],
  oneBlogPostView: '',
  blogPostsByCategory: [],
  isLoading: true
};

const blogPostsViewsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_BLOG_POSTS_VIEWS:
      return {
        ...state,
        isLoading: false,
        allBlogPostsViews: action.payload
      };

    case GET_RECENT_TEN_VIEWS:
      return {
        ...state,
        isLoading: false,
        recentTenViews: action.payload
      };

    case GET_ONE_BLOG_POST_VIEW:
      return {
        ...state,
        isLoading: false,
        oneBlogPostView: action.payload
      };

    case GET_BLOG_POSTS_VIEWS_BY_CATEGORY:
      return {
        ...state,
        isLoading: false,
        blogPostsByCategory: action.payload
      };


    case CREATE_BLOG_POST_VIEW:
      return {
        ...state,
        allBlogPostsViews: [...state.allBlogPostsViews, action.payload]
      };

    case CREATE_BLOG_POST_VIEW_FAIL:
    case DELETE_BLOG_POST_VIEW_FAIL:
    case UPDATE_BLOG_POST_VIEW_FAIL:
    case GET_BLOG_POSTS_VIEWS_FAIL:
    case GET_ONE_BLOG_POST_VIEW_FAIL:
    case GET_BLOG_POSTS_VIEWS_BY_CATEGORY_FAIL:
    case GET_RECENT_TEN_VIEWS_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      };

    case UPDATE_BLOG_POST_VIEW:
      return {
        ...state,
        allBlogPostsViews: state.allBlogPostsViews.map((bPostView) => {

          if (bPostView._id === action.payload.blogPostViewID) {

            return {
              ...bPostView,
              ...action.payload
            }

          } else return bPostView;
        })
      }

    case DELETE_BLOG_POST_VIEW:
      return {
        ...state,
        allBlogPostsViews: state.allBlogPostsViews.filter(bPostView => bPostView._id !== action.payload)
      }

    case BLOG_POSTS_VIEWS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default blogPostsViewsReducer;