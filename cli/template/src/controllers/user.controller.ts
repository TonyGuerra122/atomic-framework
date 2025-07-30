import {
  Controller,
  Get,
  Request,
  Response,
} from '@tonyguerradev/atomic-framework';
import UserService from 'src/services/user.service';
import BaseController from './base.controller';

@Controller('/user')
export default class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
  }

  @Get('/')
  public async listUsers(_: Request, res: Response) {
    try {
      const users = await this.service.findAll();

      this.ok(res, 'Success', users);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
