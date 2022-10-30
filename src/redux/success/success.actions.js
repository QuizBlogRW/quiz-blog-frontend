import { SET_SUCCESS, CLEAR_SUCCESS } from "./success.types";

// RETURN SUCCESS
export const returnSuccess = (msg, status, id = null) => {
  return {
    type: SET_SUCCESS,
    payload: { msg, status, id },
  }
}

// CLEAR SUCCESS
export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  }

}