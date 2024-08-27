import type { MutableRefObject, Ref } from 'react'

function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as MutableRefObject<T>).current = node
      }
    })
}

function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalHandler?: (event: E) => void,
  internalHandler?: (event: E) => void
) {
  return function (event: E) {
    originalHandler?.(event)
    if (!event.defaultPrevented) {
      internalHandler?.(event)
    }
  }
}

export { composeRefs, composeEventHandlers }
