import React from 'react'
import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Root, Field } from '../index'

describe('Typing Testing', () => {
  test('should change the input value', async () => {
    render(
      <Root>
        <Field />
        <Field />
        <Field />
      </Root>
    )

    const inputs = screen.getAllByRole('textbox')
    const text = '123'.split('')

    for (const [index, input] of inputs.entries()) {
      await userEvent.type(input, text[index])
    }

    inputs.forEach((input, index) => {
      expect(input).toHaveValue(text[index])
    })
  })
})
