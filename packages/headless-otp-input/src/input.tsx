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
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const OtpInputContext = createContext<ContextValue>({
  register: () => {},
  unregister: () => {},
  orderRegister: () => {},
  values: {},
  onChange: () => {},
  onKeyDown: () => {},
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

  const getNextElement = (currEl: HTMLInputElement) => {
    const index = elements.indexOf(currEl)
    return elements[index + 1]
  }

  const hasValueAfter = (currEl: HTMLInputElement) => {
    const index = elements.indexOf(currEl)
    if (index < 0) {
      throw new Error('Input index not found on hasValueAfter')
    }

    return elements
      .slice(index + 1)
      .map((el) => values[el.id])
      .some((value) => value)
  }

  const focusPrevious = (currEl: HTMLInputElement) => {
    const index = elements.indexOf(currEl)
    if (index < 0) {
      throw new Error('Input index not found on focusPrevious')
    }

    const previousElement = elements[Math.max(index - 1, 0)]
    previousElement.focus()
  }

  const deleteValue = (element: HTMLInputElement) => {
    setValues((prev) => {
      const curr = { ...prev }
      const valueArray = elements
        .map((el) => (el === element ? '' : curr[el.id]))
        .filter((value) => value)
      elements.forEach((el, index) => {
        curr[el.id] = valueArray[index] || ''
      })

      return curr
    })
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target
    setValues((prev) => ({ ...prev, [id]: value }))

    if (value) {
      const nextElement = getNextElement(event.target)
      if (nextElement) {
        nextElement.focus()
      }
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currEl = event.currentTarget
    if (event.key === 'Backspace') {
      // press delete where the input is empty
      if (!currEl.value) {
        const index = elements.indexOf(currEl)
        if (index > 0) {
          deleteValue(elements[index - 1])
          focusPrevious(currEl)
        }
        return
      }
      // press delete where the input has value after
      if (hasValueAfter(currEl)) {
        event.preventDefault()
        deleteValue(currEl)
        focusPrevious(currEl)
      }
    }
  }

  return (
    <OtpInputContext.Provider
      value={{
        register,
        unregister,
        orderRegister,
        values,
        onChange,
        onKeyDown,
      }}
    >
      <div {...props}>{props.children}</div>
    </OtpInputContext.Provider>
  )
}

function Field() {
  const id = useId()
  const ref = useRef<HTMLInputElement>(null)
  const { register, unregister, orderRegister, values, onChange, onKeyDown } =
    useContext(OtpInputContext)

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
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  )
}

export { Root, Field }
