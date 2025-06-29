import { ServiceException, HttpStatus, Response } from 'atomic-framework';

export default abstract class BaseController {
  /**
   * Verifica se o Erro é uma instancia de ServiceException, caso não for retorna status 500(INTERNAL SERVER ERROR)
   * @param response
   * @param error
   */
  protected async handleError(
    response: Response,
    error: unknown,
  ): Promise<void> {
    const errorImp =
      error instanceof ServiceException
        ? error
        : new ServiceException(
            'Erro interno do servidor',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

    response.status(errorImp.statusCode).send({ message: errorImp.message });
  }

  /**
   * Retorna o status 200 (OK) para a end-point
   * @param response
   * @param message
   * @param data
   */
  protected ok(response: Response, message: string, data?: object): void {
    response.status(HttpStatus.OK).send({ message, data });
  }

  /**
   * Retorna o status 201 (CREATED) para a end-point
   * @param response
   * @param message
   * @param data
   */
  protected created(response: Response, message: string, data?: object): void {
    response.status(HttpStatus.CREATED).send({ message, data });
  }

  /**
   * Retorna o status 401 (UNAUTHORIZED) para a end-point
   * @param response
   * @param message
   */
  protected unauthorized(response: Response, message: string): void {
    response.status(HttpStatus.UNAUTHORIZED).send({ message });
  }

  /**
   * Retorna o status 404 (NOT FOUND) para a end-point
   * @param response
   * @param message
   */
  protected notFound(response: Response, message: string): void {
    response.status(HttpStatus.NOT_FOUND).send({ message });
  }

  /**
   * Retorna o status 500 (INTERNAL SERVER ERROR) para a end-point
   * @param response
   * @param message
   */
  protected internalServerError(response: Response, message: string): void {
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message });
  }
}
