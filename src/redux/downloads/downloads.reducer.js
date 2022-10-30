import { SAVE_DOWNLOAD, SAVE_DOWNLOAD_FAIL, GET_DOWNLOADS, GET_DOWNLOADS_FAIL, DELETE_DOWNLOAD, DELETE_DOWNLOAD_FAIL, DOWNLOADS_LOADING, GET_CREATOR_DOWNLOADS, GET_CREATOR_DOWNLOADS_FAIL, GET_USER_DOWNLOADS, GET_USER_DOWNLOADS_FAIL } from './downloads.types';

const INITIAL_STATE = {
  isLoading: true,
  totalPages: 0,
  allDownloads: [],
  creatorDownloads: [],
  userDownloads: [],
}

const downloadsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_DOWNLOADS:
      return {
        ...state,
        isLoading: false,
        totalPages: action.payload.totalPages,
        allDownloads: action.payload.downloads
      }

    case GET_CREATOR_DOWNLOADS:
      return {
        ...state,
        isLoading: false,
        creatorDownloads: action.payload
      }

    case GET_USER_DOWNLOADS:
      return {
        ...state,
        isLoading: false,
        userDownloads: action.payload
      };

    case SAVE_DOWNLOAD_FAIL:
    case GET_DOWNLOADS_FAIL:
    case DELETE_DOWNLOAD_FAIL:
    case GET_CREATOR_DOWNLOADS_FAIL:
    case GET_USER_DOWNLOADS_FAIL:
      return {
        ...state,
        msg: 'Failed!'
      }

    case SAVE_DOWNLOAD:
      return {
        ...state,
        allDownloads: [...state.allDownloads, action.payload]
      }
    
    case DELETE_DOWNLOAD:
      return {
        ...state,
        allDownloads: state.allDownloads.filter(download => download._id !== action.payload)
      }

    case DOWNLOADS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default downloadsReducer