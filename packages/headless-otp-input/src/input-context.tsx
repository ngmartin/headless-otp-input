import React, { createContext, useContext } from 'react'

type ContextValue = {
  register: (el: HTMLInputElement) => void
  unregister: (el: HTMLInputElement) => void
  getIndex: (el?: HTMLInputElement | null) => number
  values: string[]
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onInput: (event: React.FormEvent<HTMLInputElement>) => void
  onMouseDown: (event: React.MouseEvent<HTMLInputElement>) => void
}

const noop = () => {}

const initContextValue: ContextValue = {
  values: [],
  register: noop,
  unregister: noop,
  getIndex: () => -1,
  onKeyDown: noop,
  onInput: noop,
  onMouseDown: noop,
}

const InputContext = createContext<ContextValue>(initContextValue)

function InputProvider({
  value,
  children,
}: {
  value: ContextValue
  children: React.ReactNode
}) {
  return <InputContext.Provider value={value}>{children}</InputContext.Provider>
}

function useInputContext() {
  return useContext(InputContext)
}

export { InputProvider, useInputContext }
