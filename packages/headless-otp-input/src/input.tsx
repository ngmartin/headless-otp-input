import React, { useEffect, useRef, useState, useCallback } from 'react'
import { InputProvider, useInputContext } from './input-context'

type RootProps = {
  defaultValue?: string[]
  blurOnCompleted?: boolean
  value?: string[]
  transform?: (value: string) => string
  onChange?: (values: string[]) => void
  onCompleted?: (value: string[]) => void
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>

function Root(props: RootProps) {
  const {
    blurOnCompleted = false,
    defaultValue,
    value,
    transform = (value) => value,
    onChange = () => {},
    onCompleted = () => {},
    ...restProps
  } = props

  const [inputRefs, setInputRefs] = useState<HTMLInputElement[]>([])
  const [internalValues, setInternalValues] = useState<string[]>([])
  const numberOfInputs = inputRefs.length
  const inputValues = value || internalValues
  const setInputValues = value ? onChange : setInternalValues

  useEffect(() => {
    // if the component is not controlled, we need to set the default values
    if (!value) {
      const initialValues = defaultValue
        ? defaultValue.slice(0, numberOfInputs)
        : new Array<string>(numberOfInputs).fill('')
      setInputValues(initialValues)
    }
    // defaultValue is uncontrolled prop, we don't need to re-run if defaultValue changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfInputs])

  const register = useCallback((el: HTMLInputElement) => {
    setInputRefs((prev) => [...prev, el])
  }, [])

  const unregister = useCallback((el: HTMLInputElement) => {
    setInputRefs((prev) => prev.filter((item) => item !== el))
  }, [])

  const getIndex = useCallback(
    (el?: HTMLInputElement | null) => {
      if (!el) return -1
      return inputRefs.indexOf(el)
    },
    [inputRefs]
  )

  const getNextElement = (el: HTMLInputElement) => {
    const index = getIndex(el)
    const boundedIndex = Math.min(index + 1, numberOfInputs - 1)
    return inputRefs[boundedIndex]
  }

  const getPreviousElement = (el: HTMLInputElement) => {
    const index = getIndex(el)
    const boundedIndex = Math.max(index - 1, 0)
    return inputRefs[boundedIndex]
  }

  const hasCompleted = (values: string[]) =>
    values.filter(Boolean).length === inputRefs.length

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
    const el = inputRefs[0]
    el.focus()
    selectElement(el)
  }

  const focusLast = () => {
    const el = inputRefs[numberOfInputs - 1]
    el.focus()
    selectElement(el)
  }

  const deleteValue = (el: HTMLInputElement) => {
    const index = getIndex(el)
    setInputValues(inputValues.map((value, i) => (i === index ? '' : value)))
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
    const { value } = el

    if (!value) {
      deleteValue(el)
      return
    }

    const newInputValues = [...inputValues]
    let index = getIndex(el)

    for (const char of value) {
      const transformedChar = transform(char)
      if (transformedChar) {
        newInputValues[index] = transformedChar
        index += 1
      }
      if (index >= numberOfInputs) {
        break
      }
    }
    setInputValues(newInputValues)

    if (hasCompleted(newInputValues)) {
      onCompleted(newInputValues)
      if (blurOnCompleted) {
        el.blur()
        return
      }
    }

    if (index > 0) {
      focusNext(inputRefs[index - 1])
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    if (el.value) {
      selectElement(el)
    }
  }

  return (
    <InputProvider
      value={{
        register,
        unregister,
        getIndex,
        values: inputValues,
        onKeyDown: handleKeyDown,
        onInput: handleInput,
        onMouseDown: handleMouseDown,
      }}
    >
      <div {...restProps} />
    </InputProvider>
  )
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement>

function Field(props: FieldProps) {
  const ref = useRef<HTMLInputElement>(null)
  const {
    register,
    unregister,
    getIndex,
    values,
    onKeyDown,
    onInput,
    onMouseDown,
  } = useInputContext()
  const index = getIndex(ref.current)

  useEffect(() => {
    const el = ref.current
    if (el) register(el)

    return () => {
      if (el) unregister(el)
    }
  }, [register, unregister])

  return (
    <input
      aria-label={`Please enter OTP character ${index + 1}`}
      type="text"
      autoComplete="one-time-code"
      inputMode="numeric"
      ref={ref}
      value={values[index] || ''}
      onKeyDown={onKeyDown}
      onInput={onInput}
      onMouseDown={onMouseDown}
      {...props}
    />
  )
}

export { Root, Field }
