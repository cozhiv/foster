import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface dashboardState {
  newUserInput: string,
  toListInput: string,
  invisibleUA: boolean
}
const initialState: dashboardState = {
  newUserInput: "",
  toListInput: "",
  invisibleUA: true
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {

    setToListInput: (state, action: PayloadAction<string>) => {
      state.toListInput = action.payload
    },

    setVisibleUA: (state) => {
      state.invisibleUA = false
    },

    setInvisibleUA: (state) => {
      state.invisibleUA = true
    }

  },
})

export const { setToListInput, setVisibleUA, setInvisibleUA } = dashboardSlice.actions

export default dashboardSlice.reducer  