import {
  HttpStatus,
  Service,
  ServiceException,
} from '@tonyguerradev/atomic-framework';
import User from 'src/models/user';
import UserRepository from 'src/repositories/user.repository';

@Service()
export default class UserService {
  constructor(private readonly repository: UserRepository) {}

  public async findById(id: number): Promise<User | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error(error);
      throw new ServiceException(
        'Error on ask user by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error(error);
      throw new ServiceException(
        'Error on list users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
