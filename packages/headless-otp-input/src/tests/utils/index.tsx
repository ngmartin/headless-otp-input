import React from 'react'
import * as Input from '../../index'

function renderInput({ numOfInputs = 6 }: { numOfInputs?: number } = {}) {
  return (
    <Input.Root>
      {Array.from({ length: numOfInputs }).map((_, index) => (
        <Input.Field key={index} />
      ))}
    </Input.Root>
  )
}

export { renderInput }
