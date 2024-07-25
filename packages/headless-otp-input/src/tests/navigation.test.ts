import { test, describe, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderInput } from './utils'

// Todo: refactor this after having the default value prop
describe('Navigation Testing', () => {
  test('should focus the next input after typing', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[0], '1')
    expect(inputs[1]).toHaveFocus()
  })

  test('should allow ArrowRight', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.click(inputs[0])
    await userEvent.keyboard('[ArrowRight]')

    expect(inputs[1]).toHaveFocus()
  })

  test('should allow ArrowLeft', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.click(inputs[1])
    await userEvent.keyboard('[ArrowLeft]')

    expect(inputs[0]).toHaveFocus()
  })

  test('should allow ArrowUp', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const text = '123456'
    const inputs = screen.getAllByRole('textbox')

    for (const [index, input] of inputs.entries()) {
      await userEvent.type(input, text[index])
    }
    await userEvent.click(inputs[text.length - 1])
    await userEvent.keyboard('[ArrowUp]')

    expect(inputs[0]).toHaveFocus()
  })

  test('should allow ArrowDown', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const text = '123456'
    const inputs = screen.getAllByRole('textbox')

    for (const [index, input] of inputs.entries()) {
      await userEvent.type(input, text[index])
    }
    await userEvent.click(inputs[0])
    await userEvent.keyboard('[ArrowDown]')

    expect(inputs[text.length - 1]).toHaveFocus()
  })

  test('should select text on focus', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]

    await userEvent.type(inputs[0], '1')
    await userEvent.click(inputs[0])

    expect(inputs[0].selectionStart).toEqual(0)
    expect(inputs[0].selectionEnd).toEqual(1)
  })
})
