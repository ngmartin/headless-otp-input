import { test, describe, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderInput } from './utils'

// Todo: refactor this after having the default value prop
describe('Delete Character Testing', () => {
  test('should delete the character on backspace', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.click(inputs[0])
    await userEvent.keyboard('[Backspace]')

    expect(inputs[0]).toHaveValue('')
  })

  test('should allow pressing backspace on the empty input', async () => {
    render(renderInput({ numOfInputs: 6 }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.click(inputs[1])
    await userEvent.keyboard('[Backspace]')

    expect(inputs[0]).toHaveValue('')
  })
})
