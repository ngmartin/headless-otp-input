# The unstyled, fully customizable, and accessible OTP input component for React.

[![codecov](https://codecov.io/github/ngmartin/headless-otp-input/graph/badge.svg?token=77A38WTHEV)](https://codecov.io/github/ngmartin/headless-otp-input)
[![npm bundle size](https://img.shields.io/bundlephobia/min/headless-otp-input)](https://www.npmjs.com/package/headless-otp-input)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/headless-otp-input)](https://www.npmjs.com/package/headless-otp-input)

## Installation

```bash
npm install headless-otp-input
```

## Usage

```tsx
"use client";
import { Root, Field } from "headless-otp-input";

function App() {
  return (
    <Root>
      <Field />
      <Field />
      <Field />
      <span>separator</span>
      <Field />
      <Field />
      <Field />
    </Root>
  );
}
```

## Example

The example below uses `tailwindcss`.

<img width="476" alt="Screenshot 2024-08-01 at 23 04 19" src="https://github.com/user-attachments/assets/93eb04d6-362d-4be6-aa5b-517b1177e473">

```tsx
"use client";
import * as OTPInput from "headless-otp-input";

function OTPInputField() {
  return (
    <OTPInput.Field className="border-b-2 outline-none border-pink-400 w-14 text-center text-2xl p-1 hover:border-pink-600 focus:border-pink-800" />
  );
}

function App() {
  return (
    <OTPInput.Root className="flex justify-center items-center gap-4 my-8">
      <OTPInputField />
      <OTPInputField />
      <OTPInputField />
      <OTPInputField />
      <OTPInputField />
      <OTPInputField />
    </OTPInput.Root>
  );
}
```

## API Reference

### Root Component

The Root component acts as the container for the individual OTP fields.

#### Props

| Name            | Type                         | Default                                    | Description                                                                                                                                                                                                    |
| --------------- | ---------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue    | `string[]`                   | `['', ...]` length equals number of fields | (Optional) The default values for each OTP field. Used for uncontrolled components.                                                                                                                            |
| blurOnCompleted | `boolean`                    | `false`                                    | (Optional) If true, the input fields will lose focus once all fields are filled.                                                                                                                               |
| value           | `string[]`                   | `undefined`                                | (Optional) The values for each OTP field. Used for controlled components.                                                                                                                                      |
| onChange        | `(value: string[]) => void`  | `undefined`                                | (Optional) The callback function that is called when the value changes. Used for controlled components.                                                                                                        |
| onCompleted     | `(values: string[]) => void` | `undefined`                                | (Optional) The callback function that is called when all fields are filled.                                                                                                                                    |
| transform       | `(value: string) => string`  | `(value) => value`                         | (Optional) The function that transforms the value of each field. If returns `""`, the field will ignore the input. For example, `transform={(value) => value.replace(/[^0-9]/g, "")}` will only allow numbers. |

### Field Component

The Field component represents an individual OTP input field.

#### Props

All props for Field component are directly passed to the underlying `<input>` element. It accepts all standard HTML input attributes.
