import { GET_BLOG_POSTS, GET_BLOG_POSTS_FAIL, GET_ONE_BLOG_POST, GET_ONE_BLOG_POST_FAIL, GET_BLOG_POSTS_BY_CATEGORY, GET_BLOG_POSTS_BY_CATEGORY_FAIL, CREATE_BLOG_POST, CREATE_BLOG_POST_FAIL, DELETE_BLOG_POST, DELETE_BLOG_POST_FAIL, UPDATE_BLOG_POST, UPDATE_BLOG_POST_FAIL, BLOG_POSTS_LOADING } from "./blogPosts.types";

const INITIAL_STATE = {
  allBlogPosts: [],
  oneBlogPost: '',
  blogPostsByCategory: [],
  isLoading: true
};

const blogPostsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_BLOG_POSTS:
      return {
        ...state,
        isLoading: false,
        allBlogPosts: action.payload
      };

    case GET_ONE_BLOG_POST:
      return {
        ...state,
        isLoading: false,
        oneBlogPost: action.payload
      };

    case GET_BLOG_POSTS_BY_CATEGORY:
      return {
        ...state,
        isLoading: false,
        blogPostsByCategory: action.payload
      };


    case CREATE_BLOG_POST:
      return {
        ...state,
        allBlogPosts: [...state.allBlogPosts, action.payload]
      };

    case CREATE_BLOG_POST_FAIL:
    case DELETE_BLOG_POST_FAIL:
    case UPDATE_BLOG_POST_FAIL:
    case GET_BLOG_POSTS_FAIL:
    case GET_ONE_BLOG_POST_FAIL:
    case GET_BLOG_POSTS_BY_CATEGORY_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      };

    case UPDATE_BLOG_POST:
      return {
        ...state,
        allBlogPosts: state.allBlogPosts.map((bPost) => {

          if (bPost._id === action.payload.blogPostID) {

            return {
              ...bPost,
              title: action.payload.title,
              markdown: action.payload.markdown,
              postCategory: action.payload.postCategory,
              bgColor: action.payload.bgColor
            }

          } else return bPost;
        })
      }

    case DELETE_BLOG_POST:
      return {
        ...state,
        allBlogPosts: state.allBlogPosts.filter(bPost => bPost._id !== action.payload)
      }

    case BLOG_POSTS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default blogPostsReducer;