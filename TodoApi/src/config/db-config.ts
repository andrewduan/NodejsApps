import { injectable } from 'tsyringe';

export interface IDbConfig {
  connectionString(): string;
}

@injectable()
export class DbConfig implements IDbConfig {
  connectionString(): string {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    return `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
  }
}
