import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
  useCallback,
} from 'react'

type RootProps = {
  onCompleted?: (value: string[]) => void
} & React.HTMLAttributes<HTMLDivElement>
type ContextValue = {
  register: (id: string) => void
  unregister: (id: string) => void
  orderRegister: (el: HTMLInputElement) => void
  values: Record<string, string>
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void
  onInput: (event: React.FormEvent<HTMLInputElement>) => void
  onMouseDown: (event: React.MouseEvent<HTMLInputElement>) => void
}

const OtpInputContext = createContext<ContextValue>({
  register: () => {},
  unregister: () => {},
  orderRegister: () => {},
  values: {},
  onKeyDown: () => {},
  onFocus: () => {},
  onInput: () => {},
  onMouseDown: () => {},
})

function Root(props: RootProps) {
  const { onCompleted = () => {}, children, ...restProps } = props
  const elements: HTMLInputElement[] = []

  const [elementValues, setElementValues] = useState<Record<string, string>>({})

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
      .map((el) => elementValues[el.id])
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

  const focusNext = (el: HTMLInputElement) => {
    const nextEl = getNextElement(el)
    if (nextEl === el) {
      requestAnimationFrame(() => nextEl.select())
    } else {
      nextEl.focus()
    }
  }

  const focusNearestEmpty = () => {
    const nearestEmptyEl = elements.find((el) => !el.value)
    nearestEmptyEl?.focus()
  }

  const focusFirst = () => {
    elements[0].focus()
  }

  const deleteValue = (el: HTMLInputElement) => {
    setElementValues((prev) => {
      const curr = { ...prev }
      const values = elements
        .map((element) => (element === el ? '' : curr[element.id]))
        .filter((value) => value)
      elements.forEach((element, index) => {
        curr[element.id] = values[index] || ''
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
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusPrevious(el)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (el.value) {
        focusNext(el)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusFirst()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusNearestEmpty()
    }
  }

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select()
  }

  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    const { id, value } = el
    setElementValues((prev) => ({ ...prev, [id]: value }))

    if (value) {
      const nextEl = getNextElement(el)
      if (nextEl === el) {
        const values = elements.map((el) => el.value)
        onCompleted(values)
        nextEl.blur()
      } else {
        nextEl.focus()
      }
    }
  }

  const onMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    if (!value) {
      event.preventDefault()
      focusNearestEmpty()
    }
  }

  return (
    <OtpInputContext.Provider
      value={{
        register,
        unregister,
        orderRegister,
        values: elementValues,
        onKeyDown,
        onFocus,
        onInput,
        onMouseDown,
      }}
    >
      <div {...restProps}>{children}</div>
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
    onMouseDown,
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
      onMouseDown={onMouseDown}
    />
  )
}

export { Root, Field }
