import { test, describe, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderInput } from './utils'

describe('Delete Character Testing', () => {
  test('should delete the character on backspace', async () => {
    render(renderInput({ numOfInputs: 6, defaultValue: '123456' }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.click(inputs[0])
    await userEvent.keyboard('[Backspace]')

    expect(inputs[0]).toHaveValue('')
  })

  test('should allow pressing backspace on the empty input', async () => {
    render(renderInput({ numOfInputs: 6, defaultValue: '12' }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.click(inputs[2])
    await userEvent.keyboard('[Backspace]')

    expect(inputs[1]).toHaveValue('')
  })
})
