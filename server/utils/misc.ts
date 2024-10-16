import type { H3Event } from 'h3'

const TAG_REGEX = /<[^>]+(>|$)/g

export function maskSecret(secret: string) {
  return (value: string) => value.replaceAll(secret, '*'.repeat(secret.length))
}

export function getMaybeForwardedRequestHost(event: H3Event) {
  getRequestHeader(event, 'x-forwarded-host') || getRequestHost(event)
}

export function stripTags(input?: string) {
  if (!input) return ''

  return input.replace(TAG_REGEX, '')
}
