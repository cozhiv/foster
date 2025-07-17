'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { increment } from '../lib/slices/syncListSlice'
import { setVisibleUA } from '@/lib/slices/dashboardSlice'

export default function StoreProvider({
  count,
  children,
}: {
  count: number
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    // storeRef.current.dispatch(increment())
    // storeRef.current.dispatch(setVisibleUA())
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}