import IModel from 'src/interfaces/interfaces.model';

interface UserProps {
  id?: number;
  name: string;
  email: string;
  password: string;
  readonly createdAt?: Date;
  updatedAt?: Date;
}

export default class User implements IModel {
  constructor(private readonly props: UserProps) {}

  public get id(): number | undefined {
    return this.props.id;
  }

  public set id(value: number | undefined) {
    this.props.id = value;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(value: string) {
    this.props.name = value;
  }

  public get email(): string {
    return this.props.email;
  }

  public set email(value: string) {
    this.props.email = value;
  }

  public get password(): string {
    return this.props.password;
  }

  public set password(value: string) {
    this.props.password = value;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt || Date.now());
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ? new Date(this.props.updatedAt) : new Date();
  }

  public set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  public toPrisma(): object {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
