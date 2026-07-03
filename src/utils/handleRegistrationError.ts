import { Alert } from 'react-native';

/**
 * Displays an alert with the given error message and throws an Error.
 *
 * Use this to halt execution when a critical registration step fails
 * (e.g. missing permissions or project ID). The function never returns
 * — it always throws, so callers can rely on it for early exit.
 *
 * @param errorMessage - The human-readable error message to show in the alert and throw.
 *
 * @throws {Error} Always throws a new `Error` with the same message.
 *
 * @example
 * ```ts
 * // Stops execution and shows an alert if the user denies permissions.
 * if (status !== 'granted') {
 *   handleRegistrationError('Notification permission denied');
 * }
 * ```
 */
export const handleRegistrationError = (errorMessage: string): never => {
  Alert.alert('Error', errorMessage);
  throw new Error(errorMessage);
};
