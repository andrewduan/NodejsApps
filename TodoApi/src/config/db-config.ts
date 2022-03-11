export interface IDbConfig {
  mongoDb: {
    user: string;
    password: string;
    path: string;
  };
}

export const dbConfig: IDbConfig = {
  mongoDb: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    path: process.env.MONGO_PATH,
  },
};
