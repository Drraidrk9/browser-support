export async function clipboardWrite(data: ClipboardItems) {
  if (data.length === 0) return
  if (data.length > 1) throw new Error('Support for multiple ClipboardItems is not implemented.')
  const blob = await data[0].getType(data[0].types.includes('text/plain') ? 'text/plain' : data[0].types[0])
  return navigator.clipboard.writeText(await blob.text())
}

export async function clipboardRead() {
  const str = navigator.clipboard.readText()
  return [new ClipboardItem({'text/plain': str})]
}

export function isSupported(): boolean {
  return typeof navigator.clipboard.read === 'function' && typeof navigator.clipboard.write === 'function'
}

export function isPolyfilled(): boolean {
  return navigator.clipboard.write === clipboardWrite || navigator.clipboard.read === clipboardRead
}

export function apply(): void {
  if (!isSupported()) {
    navigator.clipboard.write = clipboardWrite
    navigator.clipboard.read = clipboardRead
  }
}
