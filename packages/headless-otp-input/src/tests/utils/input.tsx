import React, { useState } from 'react'
import * as Input from '../../index'

type Props = {
  numOfInputs?: number
  defaultValue?: string[]
  blurOnCompleted?: boolean
  controlled?: string[]
  transform?: (value: string) => string
  onCompleted?: (value: string[]) => void
}

function InputWrapper({
  numOfInputs = 6,
  defaultValue,
  blurOnCompleted,
  controlled,
  transform,
  onCompleted,
}: Props = {}) {
  const [value, setValue] = useState<string[]>(controlled || [])

  return (
    <Input.Root
      defaultValue={defaultValue}
      blurOnCompleted={blurOnCompleted}
      transform={transform}
      onCompleted={onCompleted}
      value={controlled ? value : undefined}
      onChange={controlled ? setValue : undefined}
    >
      {Array.from({ length: numOfInputs }).map((_, index) => (
        <Input.Field key={index} />
      ))}
    </Input.Root>
  )
}

function renderInput(props: Props = {}) {
  return <InputWrapper {...props} />
}

export { renderInput }
