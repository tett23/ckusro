declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '@isomorphic-git/lightning-fs';

type FSAction<Payload = any> = {
  type: string;
  payload: Payload;
  error?: boolean;
  meta?: Object;
};
