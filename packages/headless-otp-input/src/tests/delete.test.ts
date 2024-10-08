import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { renderInput } from './utils'

describe('Delete Character Testing', () => {
  test('should delete the character on backspace', async () => {
    render(
      renderInput({
        numOfInputs: 6,
        defaultValue: ['1', '2', '3', '4', '5', '6'],
      })
    )
    const inputs = screen.getAllByRole('textbox')

    await userEvent.click(inputs[0])
    await userEvent.keyboard('[Backspace]')

    expect(inputs[0]).toHaveValue('')
  })

  test('should allow pressing backspace on the empty input', async () => {
    render(renderInput({ numOfInputs: 6, defaultValue: ['1', '2'] }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.click(inputs[2])
    await userEvent.keyboard('[Backspace]')

    expect(inputs[1]).toHaveValue('')
  })
})
