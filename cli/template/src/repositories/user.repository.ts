import { Repository } from '@tonyguerradev/atomic-framework';
import BaseRepository from './base.repository';
import IRepository from 'src/interfaces/interface.repository';
import User from 'src/models/user';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

@Repository()
export default class UserRepository
  extends BaseRepository<User, 'user'>
  implements IRepository<User>
{
  constructor(prisma?: PrismaClient) {
    super('user', prisma);
  }

  protected mapFromPrisma(data: PrismaUser): User {
    const { id, name, email, password, updatedAt, createdAt } = data;

    return new User({
      id,
      name,
      email,
      password,
      createdAt,
      updatedAt,
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user ? this.mapFromPrisma(user) : null;
  }
}
