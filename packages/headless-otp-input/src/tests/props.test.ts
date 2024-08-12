import { test, describe, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderInput } from './utils'

describe('Props Testing', () => {
  test('should not blur on completed by default', async () => {
    render(renderInput({ numOfInputs: 2 }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '2')

    expect(inputs[0]).not.toHaveFocus()
    expect(inputs[1]).toHaveFocus()
  })

  test('should blur on completed when blurOnCompleted is true', async () => {
    render(renderInput({ numOfInputs: 2, blurOnCompleted: true }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '2')

    expect(inputs[0]).not.toHaveFocus()
    expect(inputs[1]).not.toHaveFocus()
  })

  test('should call onCompleted when completed', async () => {
    const onCompleted = vi.fn()
    render(renderInput({ numOfInputs: 2, onCompleted }))
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '2')

    expect(onCompleted).toHaveBeenCalledTimes(1)
    expect(onCompleted).toHaveBeenCalledWith(['1', '2'])
  })

  test('should allow default value', async () => {
    render(renderInput({ numOfInputs: 2, defaultValue: ['1', '2'] }))
    const inputs = screen.getAllByRole('textbox')

    expect(inputs[0]).toHaveValue('1')
    expect(inputs[1]).toHaveValue('2')
  })

  test('should support controlled value', async () => {
    render(renderInput({ numOfInputs: 2, controlled: ['1', '2'] }))
    const inputs = screen.getAllByRole('textbox')

    expect(inputs[0]).toHaveValue('1')
    expect(inputs[1]).toHaveValue('2')

    await userEvent.type(inputs[0], '3')
    await userEvent.type(inputs[1], '4')

    expect(inputs[0]).toHaveValue('3')
    expect(inputs[1]).toHaveValue('4')
  })

  test('should transform value', async () => {
    render(
      renderInput({
        numOfInputs: 2,
        transform: (value) => (value === '1' ? 'a' : ''),
      })
    )
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], '2')
    await userEvent.type(inputs[1], '2')

    expect(inputs[0]).toHaveValue('')
    expect(inputs[1]).toHaveValue('')

    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '1')

    expect(inputs[0]).toHaveValue('a')
    expect(inputs[1]).toHaveValue('a')
  })

  test('should auto focus on first input', async () => {
    render(renderInput({ numOfInputs: 2, autoFocus: true }))
    const inputs = screen.getAllByRole('textbox')

    expect(inputs[0]).toHaveFocus()
  })
})
