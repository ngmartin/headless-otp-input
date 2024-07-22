import { test, describe, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderInput } from './utils'

describe('Props Testing', () => {
  test('should blur on completed by default', async () => {
    render(renderInput({ numOfInputs: 2 }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '2')

    expect(inputs[0]).not.toHaveFocus()
    expect(inputs[1]).not.toHaveFocus()
  })

  test('should blur on completed when pasting', async () => {
    render(renderInput({ numOfInputs: 2 }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.click(inputs[0])
    await userEvent.paste('12')

    expect(inputs[0]).not.toHaveFocus()
    expect(inputs[1]).not.toHaveFocus()
  })

  test('should focus on last input when blurOnCompleted is false', async () => {
    render(renderInput({ numOfInputs: 2, blurOnCompleted: false }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '2')

    expect(inputs[0]).not.toHaveFocus()
    expect(inputs[1]).toHaveFocus()
  })

  test('should focus on last input when blurOnCompleted is false and pasting', async () => {
    render(renderInput({ numOfInputs: 2, blurOnCompleted: false }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.click(inputs[0])
    await userEvent.paste('12')

    expect(inputs[0]).not.toHaveFocus()
    expect(inputs[1]).toHaveFocus()
  })

  test('should call onCompleted when completed', async () => {
    const onCompleted = vi.fn()
    render(renderInput({ numOfInputs: 2, onCompleted }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '2')

    expect(onCompleted).toHaveBeenCalledTimes(1)
    expect(onCompleted).toHaveBeenCalledWith('12')
  })
})
