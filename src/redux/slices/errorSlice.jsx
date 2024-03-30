import { createSlice } from '@reduxjs/toolkit';

export const errorSlice = createSlice({
    name: 'error',
    initialState: {
        msg: {},
        status: null,
        id: null
    },

    reducers: {
        returnErrors: (state, action) => {
            state.msg = action.payload.msg;
            state.status = action.payload.status;
            state.id = action.payload.id;
        },

        clearErrors: (state) => {
            state.msg = {};
            state.status = null;
            state.id = null;
        },
    },
});

// Action creators are generated for each case reducer function
export const { returnErrors, clearErrors } = errorSlice.actions;

// Export the reducer, either as a default or named export
export default errorSlice.reducer;