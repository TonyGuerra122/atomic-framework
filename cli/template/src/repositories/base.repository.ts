import { PrismaClient } from '@prisma/client';
import { getInjectable } from '@tonyguerradev/atomic-framework';
import IModel from 'src/interfaces/interfaces.model';

type PrismaModelName = {
  [K in keyof PrismaClient as K extends string
    ? K
    : never]: PrismaClient[K] extends {
    findMany: (...args: any) => any;
    findUnique: (...args: any) => any;
  }
    ? K
    : never;
}[Extract<keyof PrismaClient, string>];

type BaseDelegate<T> = {
  findMany(args?: object): Promise<T[]>;
  findUnique(args: { where: any }): Promise<T | null>;
  create(args: { data: any }): Promise<T>;
  update(args: { where: any; data: any }): Promise<T>;
  delete(args: { where: any }): Promise<void>;
};

export default abstract class BaseRepository<
  TEntity extends IModel,
  TModelName extends PrismaModelName,
  TDelegate extends BaseDelegate<TEntity> = BaseDelegate<TEntity>,
> {
  protected readonly prisma: PrismaClient;

  constructor(
    protected readonly model: TModelName,
    prisma?: PrismaClient,
  ) {
    const resolvedPrisma =
      prisma ?? getInjectable<PrismaClient>('PrismaClient');

    if (!resolvedPrisma) {
      throw new Error('PrismaClient is not initialized or injected.');
    }

    this.prisma = resolvedPrisma;
  }

  protected get repository(): TDelegate {
    return this.prisma[this.model] as unknown as TDelegate;
  }

  public async findAll(): Promise<TEntity[]> {
    const result = await this.repository.findMany();
    return result.map((data: any) => this.mapFromPrisma(data));
  }

  public async findById(id: number | string): Promise<TEntity | null> {
    if (!id) return null;

    const data = await this.repository.findUnique({
      where: { id },
    });

    return data ? this.mapFromPrisma(data) : null;
  }

  public async create(entity: TEntity): Promise<TEntity> {
    const data = await this.repository.create({
      data: entity.toPrisma(),
    });

    return this.mapFromPrisma(data);
  }

  public async update(id: number | string, entity: TEntity): Promise<TEntity> {
    const result = await this.repository.update({
      where: { id },
      data: entity.toPrisma(),
    });

    return this.mapFromPrisma(result);
  }

  public async delete(id: number | string): Promise<void> {
    await this.repository.delete({
      where: { id },
    });
  }

  protected abstract mapFromPrisma(data: Partial<TEntity>): TEntity;
}
