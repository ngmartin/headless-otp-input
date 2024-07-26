import React from 'react'
import * as Input from '../../index'

function renderInput({
  numOfInputs = 6,
  blurOnCompleted,
  onCompleted,
}: {
  numOfInputs?: number
  blurOnCompleted?: boolean
  onCompleted?: (value: string) => void
} = {}) {
  return (
    <Input.Root blurOnCompleted={blurOnCompleted} onCompleted={onCompleted}>
      {Array.from({ length: numOfInputs }).map((_, index) => (
        <Input.Field key={index} />
      ))}
    </Input.Root>
  )
}

export { renderInput }
