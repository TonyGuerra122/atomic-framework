import {
  Controller,
  Get,
  Request,
  Response,
} from '@tonyguerradev/atomic-framework';

import BaseController from './base.controller';

@Controller('/')
export default class HelloController extends BaseController {
  @Get('/')
  public sayHello(req: Request, res: Response): void {
    this.ok(res, 'Hello, World!');
  }
}
