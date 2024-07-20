import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
  useCallback,
} from 'react'

type RootProps = React.HTMLAttributes<HTMLDivElement>
type ContextValue = {
  register: (id: string) => void
  unregister: (id: string) => void
  orderRegister: (el: HTMLInputElement) => void
  values: Record<string, string>
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void
  onInput: (event: React.FormEvent<HTMLInputElement>) => void
}

const OtpInputContext = createContext<ContextValue>({
  register: () => {},
  unregister: () => {},
  orderRegister: () => {},
  values: {},
  onKeyDown: () => {},
  onFocus: () => {},
  onInput: () => {},
})

function Root(props: RootProps) {
  const elements: HTMLInputElement[] = []

  const [values, setValues] = useState<Record<string, string>>({})

  const register = useCallback((id: string) => {
    setValues((prev) => ({ ...prev, [id]: '' }))
  }, [])

  const unregister = useCallback((id: string) => {
    setValues((prev) => {
      const curr = { ...prev }
      delete curr[id]
      return curr
    })
  }, [])

  const orderRegister = (el: HTMLInputElement) => {
    if (!elements.includes(el)) {
      elements.push(el)
    }
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

  const hasValueAfter = (el: HTMLInputElement) => {
    const index = getIndexByElement(el)
    return elements
      .slice(index + 1)
      .map((el) => values[el.id])
      .some((value) => value)
  }

  const focusPrevious = (el: HTMLInputElement) => {
    const prevEl = getPreviousElement(el)
    if (prevEl === el) {
      requestAnimationFrame(() => prevEl.select())
    } else {
      prevEl.focus()
    }
  }

  const deleteValue = (el: HTMLInputElement) => {
    setValues((prev) => {
      const curr = { ...prev }
      const valueArray = elements
        .map((element) => (element === el ? '' : curr[element.id]))
        .filter((value) => value)
      elements.forEach((element, index) => {
        curr[element.id] = valueArray[index] || ''
      })

      return curr
    })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    if (event.key === 'Backspace') {
      // press delete where the input is empty
      if (!el.value) {
        deleteValue(getPreviousElement(el))
        focusPrevious(el)
        return
      }
      // press delete where the input has value after
      if (hasValueAfter(el)) {
        event.preventDefault()
        deleteValue(el)
        focusPrevious(el)
      }
    }
  }

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select()
  }

  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget
    setValues((prev) => ({ ...prev, [id]: value }))

    if (value) {
      const nextEl = getNextElement(event.currentTarget)
      nextEl.focus()
    }
  }

  return (
    <OtpInputContext.Provider
      value={{
        register,
        unregister,
        orderRegister,
        values,
        onKeyDown,
        onFocus,
        onInput,
      }}
    >
      <div {...props}>{props.children}</div>
    </OtpInputContext.Provider>
  )
}

function Field() {
  const id = useId()
  const ref = useRef<HTMLInputElement>(null)
  const {
    register,
    unregister,
    orderRegister,
    values,
    onKeyDown,
    onFocus,
    onInput,
  } = useContext(OtpInputContext)

  useEffect(() => {
    if (ref.current) orderRegister(ref.current)
  }, [orderRegister])

  useEffect(() => {
    register(id)
    return () => unregister(id)
  }, [id, register, unregister])

  return (
    <input
      id={id}
      ref={ref}
      value={values[id] || ''}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onInput={onInput}
    />
  )
}

export { Root, Field }
