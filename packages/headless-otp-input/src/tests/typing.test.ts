import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderInput } from './utils'

describe('Typing Testing', () => {
  test('should change the input value', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const text = '123456'.split('')
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]

    for (const [index, input] of inputs.entries()) {
      await userEvent.type(input, text[index])
    }

    expect(inputs.map((input) => input.value)).toEqual(text)
  })

  test('should paste the text in the input', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const text = '123456'.split('')
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]

    await userEvent.click(inputs[0])
    await userEvent.paste(text.join(''))

    expect(inputs.map((input) => input.value)).toEqual(text)
  })

  test('should handle pasting shorter text', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const text = '123'.split('')
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]

    await userEvent.click(inputs[0])
    await userEvent.paste(text.join(''))

    expect(inputs.map((input) => input.value)).toEqual(
      text.concat(Array(6 - text.length).fill(''))
    )
  })

  test('should handle pasting longer text', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const text = '123456789'.split('')
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]

    await userEvent.click(inputs[0])
    await userEvent.paste(text.join(''))

    expect(inputs.map((input) => input.value)).toEqual(text.slice(0, 6))
  })

  test('should not allow more than 1 char in the input', async () => {
    // Todo: Implement this test after have default value prop
  })
})
