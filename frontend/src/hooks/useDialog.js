import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

// aria-modal="true" tells a screen reader a dialog is modal but does not make it behave like
// one: without this, Tab walks straight out into the page behind and Escape does nothing.
// Returns a ref to put on the dialog element (which needs tabIndex={-1}).
export function useDialog(onClose) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // Kept in a ref so an inline arrow prop does not re-run the effect on every render,
  // which would steal focus back to the first field while the user is typing.
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const getFocusable = () => Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((element) => element.offsetWidth > 0 || element.offsetHeight > 0)

    const [firstFocusable] = getFocusable()
    ;(firstFocusable || dialog).focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      // Send the user back to whatever opened the dialog instead of the top of the page.
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  return dialogRef
}
