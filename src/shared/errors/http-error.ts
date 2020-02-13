import { ApplicationError, BadRequestError, ResourceNotFoundError } from '.';
import { Dictionary } from 'logofx';

/**
 * The HttpError class.
 */
export abstract class HttpError extends ApplicationError {

  private static _errors: Dictionary<number, object> = new Dictionary<number, object>();
  private static _isInitialised: boolean = false;

  private _code: number;

  constructor (message?: string, errorCode?: number) {
    super(message);
    this._code = errorCode;
  }

  public get httpCode(): number {
    return this._code;
  }

  public static CREATE_INSTANCE(status: number): HttpError {
    if (!HttpError._isInitialised) {
      HttpError.initialize();
    }

    try {
      return Object.create(HttpError._errors[status]);
    } catch {
      throw new ApplicationError(`Cannot find the appropriate HttpError for status code ${status}.`);
    }
  }

  private static initialize(): void {
    const errors: object[] = [
      BadRequestError,
      ResourceNotFoundError
    ];

    errors.map(x => HttpError._errors.setValue((<any>x).CODE, x));

    HttpError._isInitialised = true;
  }
}
