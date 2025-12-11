/**
 * Error handler utility for managing and throwing typed errors
 */

export interface ErrorDetails {
  code: number
  title: string
  description: string
  originalError?: Error
}

export class AppError extends Error {
  code: number
  title: string
  description: string

  constructor(details: ErrorDetails) {
    super(details.title)
    this.code = details.code
    this.title = details.title
    this.description = details.description
    this.name = 'AppError'
  }
}

/**
 * Create a 404 error
 */
export const create404Error = (details?: Partial<ErrorDetails>) => {
  return new AppError({
    code: 404,
    title: 'Seite nicht gefunden',
    description:
      'Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.',
    ...details,
  })
}

/**
 * Create a 403 error
 */
export const create403Error = (details?: Partial<ErrorDetails>) => {
  return new AppError({
    code: 403,
    title: 'Zugriff verweigert',
    description:
      'Sie haben keine Berechtigung, auf diese Ressource zuzugreifen. Bitte melden Sie sich an oder kontaktieren Sie den Support.',
    ...details,
  })
}

/**
 * Create a 500 error
 */
export const create500Error = (details?: Partial<ErrorDetails>) => {
  return new AppError({
    code: 500,
    title: 'Interner Server Fehler',
    description:
      'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.',
    ...details,
  })
}

/**
 * Create a 503 error
 */
export const create503Error = (details?: Partial<ErrorDetails>) => {
  return new AppError({
    code: 503,
    title: 'Service nicht verfügbar',
    description:
      'Der Service ist momentan nicht verfügbar. Wir arbeiten daran, das Problem zu beheben. Bitte versuchen Sie es später erneut.',
    ...details,
  })
}

/**
 * Handle API errors and return appropriate error object
 */
export const handleAPIError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Response) {
    switch (error.status) {
      case 403:
        return create403Error({ originalError: new Error(error.statusText) })
      case 404:
        return create404Error({ originalError: new Error(error.statusText) })
      case 503:
        return create503Error({ originalError: new Error(error.statusText) })
      default:
        return create500Error({ originalError: new Error(error.statusText) })
    }
  }

  if (error instanceof Error) {
    return create500Error({ originalError: error })
  }

  return create500Error({
    originalError: new Error(String(error)),
  })
}
