import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
} from 'react'
import { InputProvider, useInputContext } from './input-context'
import { composeRefs, composeEventHandlers } from './utils'

type RootProps = {
  defaultValue?: string[]
  blurOnCompleted?: boolean
  autoFocus?: boolean
  value?: string[]
  transform?: (value: string) => string
  onChange?: (values: string[]) => void
  onCompleted?: (value: string[]) => void
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>

const Root = forwardRef<HTMLDivElement, RootProps>((props, forwardedRef) => {
  const {
    blurOnCompleted = false,
    autoFocus = false,
    defaultValue,
    value,
    transform = (value) => value,
    onChange = () => {},
    onCompleted = () => {},
    ...restProps
  } = props

  const hiddenInputRef = useRef<HTMLInputElement>(null)
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

  const firstInput = inputRefs[0]
  useEffect(() => {
    if (autoFocus) {
      firstInput?.focus()
    }
  }, [autoFocus, firstInput])

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

  const hasCompleted = (values: string[]) =>
    values.filter(Boolean).length === numberOfInputs

  const select = (el: HTMLInputElement) => {
    requestAnimationFrame(() => el.select())
  }

  const focus = (index: number) => {
    const boundedIndex = Math.min(Math.max(index, 0), numberOfInputs - 1)
    const input = inputRefs[boundedIndex]
    input.focus()
    select(input)
  }

  const deleteAt = (index: number) => {
    setInputValues(inputValues.map((value, i) => (i === index ? '' : value)))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    const index = getIndex(el)

    // press delete where the input is empty
    if (event.key === 'Backspace' && !el.value) {
      event.preventDefault()
      deleteAt(index - 1)
      focus(index - 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focus(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focus(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focus(0)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focus(numberOfInputs - 1)
    }
  }

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    const { value } = el
    let index = getIndex(el)

    if (!value) {
      deleteAt(index)
      return
    }

    const newInputValues = [...inputValues]
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

    const inputEvent = event.nativeEvent as InputEvent
    if (inputEvent.isComposing) {
      hiddenInputRef.current?.focus()
      setTimeout(() => focus(index), 50)
    } else {
      focus(index)
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    if (el.value) {
      select(el)
    }
  }

  return (
    <InputProvider
      value={{
        register,
        unregister,
        getIndex,
        values: inputValues,
        handleKeyDown,
        handleInput,
        handleMouseDown,
      }}
    >
      <div {...restProps} ref={forwardedRef} />
      <input
        ref={hiddenInputRef}
        aria-hidden="true"
        style={{ position: 'absolute', opacity: 0, left: -9999, top: -9999 }}
        tabIndex={-1}
        onFocus={(event) => (event.target.value = '')}
      />
    </InputProvider>
  )
})

type FieldProps = React.InputHTMLAttributes<HTMLInputElement>

const Field = forwardRef<HTMLInputElement, FieldProps>(
  (props, forwardedRef) => {
    const ref = useRef<HTMLInputElement>(null)
    const {
      register,
      unregister,
      getIndex,
      values,
      handleKeyDown,
      handleInput,
      handleMouseDown,
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
        value={values[index] || ''}
        {...props}
        onKeyDown={composeEventHandlers(props.onKeyDown, handleKeyDown)}
        onInput={composeEventHandlers(props.onInput, handleInput)}
        onMouseDown={composeEventHandlers(props.onMouseDown, handleMouseDown)}
        ref={composeRefs(ref, forwardedRef)}
      />
    )
  }
)

export { Root, Field }
