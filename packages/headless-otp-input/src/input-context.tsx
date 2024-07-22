import React, { createContext, useContext } from 'react'

type ContextValue = {
  register: (id: string) => void
  unregister: (id: string) => void
  orderRegister: (el: HTMLInputElement) => void
  values: Record<string, string>
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onInput: (event: React.FormEvent<HTMLInputElement>) => void
  onMouseDown: (event: React.MouseEvent<HTMLInputElement>) => void
}

const noop = () => {}

const initContextValue: ContextValue = {
  values: {},
  register: noop,
  unregister: noop,
  orderRegister: noop,
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
