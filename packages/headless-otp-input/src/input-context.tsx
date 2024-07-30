import React, { createContext, useContext } from 'react'

type ContextValue = {
  register: (el: HTMLInputElement) => void
  unregister: (el: HTMLInputElement) => void
  getIndex: (el?: HTMLInputElement | null) => number
  values: string[]
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleInput: (event: React.FormEvent<HTMLInputElement>) => void
  handleMouseDown: (event: React.MouseEvent<HTMLInputElement>) => void
}

const noop = () => {}

const initContextValue: ContextValue = {
  values: [],
  register: noop,
  unregister: noop,
  getIndex: () => -1,
  handleKeyDown: noop,
  handleInput: noop,
  handleMouseDown: noop,
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
