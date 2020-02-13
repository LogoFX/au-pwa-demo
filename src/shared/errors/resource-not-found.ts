import { HttpError } from '.';

/**
 * The ResourceNotFoundError class.
 */
export class ResourceNotFoundError extends HttpError {

  public static readonly CODE: number = 404;

  constructor(message?: string) {
    super(message ? message : `The server responses with ResourceNotFound error. Code = ${ResourceNotFoundError.CODE}`, ResourceNotFoundError.CODE);
  }
}
