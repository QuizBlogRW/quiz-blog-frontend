/**
 * @module successSlice
 * @file successSlice - Redux Slice for success
 * 
 */
import { createSlice } from '@reduxjs/toolkit';

export const successSlice = createSlice({
    name: 'success',
    initialState: {
        msg: {},
        status: null,
    },

    reducers: {
        returnSuccess: (state, action) => {
            state.msg = action.payload.msg;
            state.status = action.payload.status;
            state.id = action.payload.id;
        },

        clearSuccess: (state) => {
            state.msg = {};
            state.status = null;
            state.id = null;
        }
    },
});

// Action creators are generated for each case reducer function
export const { returnSuccess, clearSuccess } = successSlice.actions;

// Export the reducer, either as a default or named export
export default successSlice.reducer;