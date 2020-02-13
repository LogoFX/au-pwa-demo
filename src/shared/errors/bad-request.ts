import { HttpError } from ".";

/**
 * The BadRequest class
 */
export class BadRequestError extends HttpError {

  public static readonly CODE: number = 400;

  constructor(message?: string) {
    super(message ? message : `The server responses with BadRequest error. Code = ${BadRequestError.CODE}`, BadRequestError.CODE);
  }
}
