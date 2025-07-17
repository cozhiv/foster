import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface  confirmationState{
  confirmationQuestion: string
}



const initialState = {
  confirmationQuestion: "",
  act: "", // delete, update, add
  subject: "", // user, list, item
  listId: "",
  itemId: ""
}

export const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {

    setAct: (state, action: PayloadAction<string>) => {
      state.act = action.payload
    },

    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload
    },

    setListId: (state, action: PayloadAction<string>) => {
      state.listId = action.payload
    },

    setItemId: (state, action: PayloadAction<string>) => {
      state.itemId = action.payload
    },

    hideConfirmation: (state) => {
      state.confirmationQuestion = ""
    },

     setConfirmation: (state, action: PayloadAction<string>) => {
      state.confirmationQuestion = action.payload
    },


  },
})

export const { setConfirmation, hideConfirmation, setAct, setSubject, setListId, setItemId} = confirmationSlice.actions

export default confirmationSlice.reducer  