export type RepositoryType = 'git';

export type Repository = {
  type: RepositoryType;
  url: string;
  name: string;
  directory: string;
};
