import React from 'react'
import * as Input from '../../index'

function renderInput({
  numOfInputs = 6,
  defaultValue,
  blurOnCompleted,
  onCompleted,
}: {
  numOfInputs?: number
  defaultValue?: string
  blurOnCompleted?: boolean
  onCompleted?: (value: string) => void
} = {}) {
  return (
    <Input.Root
      defaultValue={defaultValue}
      blurOnCompleted={blurOnCompleted}
      onCompleted={onCompleted}
    >
      {Array.from({ length: numOfInputs }).map((_, index) => (
        <Input.Field key={index} />
      ))}
    </Input.Root>
  )
}

export { renderInput }
