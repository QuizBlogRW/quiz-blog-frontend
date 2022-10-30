import { GET_IMAGE_UPLOADS, GET_IMAGE_UPLOADS_FAIL, GET_ONE_IMAGE_UPLOAD, GET_ONE_IMAGE_UPLOAD_FAIL, GET_IMAGE_UPLOADS_BY_OWNER, GET_IMAGE_UPLOADS_BY_OWNER_FAIL, CREATE_IMAGE_UPLOAD, CREATE_IMAGE_UPLOAD_FAIL, DELETE_IMAGE_UPLOAD, DELETE_IMAGE_UPLOAD_FAIL, UPDATE_IMAGE_UPLOAD, UPDATE_IMAGE_UPLOAD_FAIL, IMAGE_UPLOADS_LOADING } from "./uploadImages.types"

const INITIAL_STATE = {
  allImageUploads: [],
  oneImageUpload: '',
  imageUploadsByOwner: [],
  isLoading: true
}

const imageUploadsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_IMAGE_UPLOADS:
      return {
        ...state,
        isLoading: false,
        allImageUploads: action.payload
      }

    case GET_ONE_IMAGE_UPLOAD:
      return {
        ...state,
        isLoading: false,
        oneImageUpload: action.payload
      }

    case GET_IMAGE_UPLOADS_BY_OWNER:
      return {
        ...state,
        isLoading: false,
        imageUploadsByOwner: action.payload
      }


    case CREATE_IMAGE_UPLOAD:
      return {
        ...state,
        allImageUploads: [...state.allImageUploads, action.payload]
      }

    case CREATE_IMAGE_UPLOAD_FAIL:
    case DELETE_IMAGE_UPLOAD_FAIL:
    case UPDATE_IMAGE_UPLOAD_FAIL:
    case GET_IMAGE_UPLOADS_FAIL:
    case GET_ONE_IMAGE_UPLOAD_FAIL:
    case GET_IMAGE_UPLOADS_BY_OWNER_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      }

    case UPDATE_IMAGE_UPLOAD:
      return {
        ...state,
        allImageUploads: state.allImageUploads.map((bPost) => {

          if (bPost._id === action.payload.blogPostID) {

            return {
              ...bPost,
              imageTitle: action.payload.imageTitle
            }

          } else return bPost
        })
      }

    case DELETE_IMAGE_UPLOAD:
      return {
        ...state,
        allImageUploads: state.allImageUploads.filter(bPost => bPost._id !== action.payload)
      }

    case IMAGE_UPLOADS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default imageUploadsReducer