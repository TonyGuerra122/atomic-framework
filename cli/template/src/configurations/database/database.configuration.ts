import { PrismaClient } from '@prisma/client';
import { Atomic, Configuration } from '@tonyguerradev/atomic-framework';

@Configuration()
export default class DatabaseConfiguration {
  @Atomic('PrismaClient')
  public getPrismaClient(): PrismaClient {
    return new PrismaClient();
  }
}
