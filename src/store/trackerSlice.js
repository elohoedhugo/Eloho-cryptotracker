import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prices: {},
  error: null,
  loading: false,
  isUpdating: true,
}

const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {
    setPrices: (state, action) => {
      state.prices = {...state.prices, ...action.payload}
    },

    setError: (state, action) => {
      state.error = action.payload
    },

    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setIsUpdating: (state, action) => {
      state.isUpdating = action.payload
    }
  }
})

export const { setPrices, setError, setLoading, setIsUpdating } = trackerSlice.actions
export default trackerSlice.reducer