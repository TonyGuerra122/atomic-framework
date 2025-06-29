export class ServiceException extends Error {
  constructor(
    message: string,
    private readonly _statusCode: number,
  ) {
    super(message);
  }

  get statusCode(): number {
    return this._statusCode;
  }
}
