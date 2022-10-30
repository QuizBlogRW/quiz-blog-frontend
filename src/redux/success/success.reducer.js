import { SET_SUCCESS, CLEAR_SUCCESS } from "./success.types";

const INITIAL_STATE = {
  msg: {},
  status: null,
  id: null
};

const successReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_SUCCESS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id
      };

    case CLEAR_SUCCESS:
      return {
        msg: {},
        status: null,
        id: null
      };

    default:
      return state;
  }
};

export default successReducer;