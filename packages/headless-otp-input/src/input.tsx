import React, { useEffect, useRef, useState, useId, useCallback } from 'react'
import { InputProvider, useInputContext } from './input-context'

type RootProps = {
  blurOnCompleted?: boolean
  onCompleted?: (value: string) => void
} & React.HTMLAttributes<HTMLDivElement>
type ElementValues = Record<string, string>

function Root(props: RootProps) {
  const {
    onCompleted = () => {},
    blurOnCompleted = true,
    children,
    ...restProps
  } = props
  const elements: HTMLInputElement[] = []

  const [elementValues, setElementValues] = useState<ElementValues>({})

  const register = useCallback((id: string) => {
    setElementValues((prev) => ({ ...prev, [id]: '' }))
  }, [])

  const unregister = useCallback((id: string) => {
    setElementValues((prev) => {
      const curr = { ...prev }
      delete curr[id]
      return curr
    })
  }, [])

  const orderRegister = (el: HTMLInputElement) => {
    const index = elements.indexOf(el)
    if (index < 0) {
      elements.push(el)
      return elements.length - 1
    }
    return index
  }

  const getIndexByElement = (el: HTMLInputElement) => {
    const index = elements.indexOf(el)
    if (index < 0) {
      throw new Error('Input index not found')
    }
    return index
  }

  const getNextElement = (el: HTMLInputElement) => {
    const index = getIndexByElement(el)
    const boundedIndex = Math.min(index + 1, elements.length - 1)
    return elements[boundedIndex]
  }

  const getPreviousElement = (el: HTMLInputElement) => {
    const index = getIndexByElement(el)
    const boundedIndex = Math.max(index - 1, 0)
    return elements[boundedIndex]
  }

  const hasCompleted = (values: ElementValues) =>
    Object.values(values).every((value) => value)

  const elementValuesToString = (values: ElementValues) =>
    elements.map((el) => values[el.id]).join('')

  const selectElement = (el: HTMLInputElement) => {
    requestAnimationFrame(() => el.select())
  }

  const focusPrevious = (el: HTMLInputElement) => {
    const prevEl = getPreviousElement(el)
    prevEl.focus()
    selectElement(prevEl)
  }

  const focusNext = (el: HTMLInputElement) => {
    const nextEl = getNextElement(el)
    nextEl.focus()
    selectElement(nextEl)
  }

  const focusFirst = () => {
    const el = elements[0]
    el.focus()
    selectElement(el)
  }

  const focusLast = () => {
    const el = elements[elements.length - 1]
    el.focus()
    selectElement(el)
  }

  const deleteValue = (el: HTMLInputElement) => {
    setElementValues((prev) => ({ ...prev, [el.id]: '' }))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    if (event.key === 'Backspace') {
      // press delete where the input is empty
      if (!el.value) {
        deleteValue(getPreviousElement(el))
        focusPrevious(el)
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusPrevious(el)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusNext(el)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusFirst()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusLast()
    }
  }

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    const { id, value } = el
    const newElementValues = { ...elementValues, [id]: value }
    setElementValues(newElementValues)

    if (hasCompleted(newElementValues)) {
      onCompleted(elementValuesToString(newElementValues))
      if (blurOnCompleted) {
        el.blur()
        return
      }
    }

    if (value) {
      focusNext(el)
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    if (el.value) {
      selectElement(el)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const pastedData = event.clipboardData.getData('text/plain').split('')
    const startIndex = elements.indexOf(el)
    const endIndex = Math.min(startIndex + pastedData.length, elements.length)
    const newElementValues = { ...elementValues }

    elements.slice(startIndex, endIndex).forEach((el, index) => {
      newElementValues[el.id] = pastedData[index]
    })
    setElementValues(newElementValues)

    if (hasCompleted(newElementValues)) {
      onCompleted(elementValuesToString(newElementValues))
      if (blurOnCompleted) {
        el.blur()
        return
      }
    }

    if (pastedData.length > 0) {
      focusNext(elements[endIndex - 1])
    }
  }

  return (
    <InputProvider
      value={{
        register,
        unregister,
        orderRegister,
        values: elementValues,
        onKeyDown: handleKeyDown,
        onInput: handleInput,
        onMouseDown: handleMouseDown,
        onPaste: handlePaste,
      }}
    >
      <div {...restProps}>{children}</div>
    </InputProvider>
  )
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement>

function Field(props: FieldProps) {
  const id = useId()
  const ref = useRef<HTMLInputElement>(null)
  const {
    register,
    unregister,
    orderRegister,
    values,
    onKeyDown,
    onInput,
    onMouseDown,
    onPaste,
  } = useInputContext()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const order = orderRegister(ref.current)
      setIndex(order)
    }
  }, [orderRegister])

  useEffect(() => {
    register(id)
    return () => unregister(id)
  }, [id, register, unregister])

  return (
    <input
      aria-label={`Please enter OTP character ${index + 1}`}
      type="text"
      maxLength={1}
      autoComplete="one-time-code"
      inputMode="numeric"
      id={id}
      ref={ref}
      value={values[id] || ''}
      onKeyDown={onKeyDown}
      onInput={onInput}
      onMouseDown={onMouseDown}
      onPaste={onPaste}
      {...props}
    />
  )
}

export { Root, Field }
