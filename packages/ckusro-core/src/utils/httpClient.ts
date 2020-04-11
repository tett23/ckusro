import * as Git from 'isomorphic-git';

let http: Git.HttpClient | null = null;

export function httpClient(): Git.HttpClient {
  if (http == null) {
    throw new Error();
  }

  return http;
}

export function setHttpClient(client: Git.HttpClient) {
  http = client;
}
