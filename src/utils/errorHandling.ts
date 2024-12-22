/**
 * Utility for standardized error handling across the application
 */

/**
 * Standard error logger with context
 * @param error The error object or message
 * @param context Description of where the error occurred
 * @param data Optional data related to the error
 */
export function logError(error: unknown, context: string, data?: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Error in ${context}:`, errorMessage);
  
  if (data) {
    console.error('Related data:', data);
  }
  
  // We could expand this in the future with:
  // - Error reporting to a service
  // - User-friendly error messages
  // - Error categorization
  // - Metrics collection
}

/**
 * Get a user-friendly error message
 * @param error The error object or message
 * @param fallback Fallback message if error is not recognized
 */
export function getUserErrorMessage(error: unknown, fallback: string = '予期せぬエラーが発生しました。'): string {
  if (error instanceof Error) {
    // Add specific error type handling here if needed
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fallback;
}
