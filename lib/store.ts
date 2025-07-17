import { configureStore } from '@reduxjs/toolkit'
import syncListReducer from './slices/syncListSlice'
import dashboardReducer from './slices/dashboardSlice'
import confirmationReducer from './slices/confirmationSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: syncListReducer,
      dashboard: dashboardReducer,
      confirmation: confirmationReducer
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']