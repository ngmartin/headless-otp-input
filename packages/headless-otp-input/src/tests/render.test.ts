import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { renderInput } from './utils'

describe('Render Testing', () => {
  test('should render the number of inputs', async () => {
    const numOfInputs = 3
    render(renderInput({ numOfInputs }))

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(numOfInputs)
  })
})
