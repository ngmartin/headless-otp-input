export * from './input'

function textToDataTransfer(text: string) {
  const dataTransfer = new DataTransfer()
  dataTransfer.setData('text/plain', text)
  return dataTransfer
}

export { textToDataTransfer }
