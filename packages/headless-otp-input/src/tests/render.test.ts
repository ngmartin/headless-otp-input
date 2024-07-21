import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderInput } from './utils'

describe('Render Testing', () => {
  test('should render the number of inputs', async () => {
    const numOfInputs = 3
    render(renderInput({ numOfInputs }))

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(numOfInputs)
  })
})
