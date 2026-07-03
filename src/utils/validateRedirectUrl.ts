/**
 * Validates a redirect URL from a notification payload.
 *
 * Notification data is untrusted input, so this function ensures the URL
 * is a string and looks like an internal path before it can be used for navigation.
 *
 * @param url - The raw URL value from notification data.
 * @returns A valid internal path string, or `undefined` if invalid.
 *
 * @example
 * ```ts
 * const redirectPath = validateRedirectUrl(data?.url);
 * if (redirectPath) {
 *   router.push(redirectPath);
 * }
 * ```
 */
export const validateRedirectUrl = (url: unknown): string | undefined => {
  if (typeof url === 'string' && url.startsWith('/')) {
    return url;
  }
  return undefined;
};
