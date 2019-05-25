declare module '*.svg' {
  const content: any;
  export default content;
}

type FSAction<Payload = any> = {
  type: string;
  payload: Payload;
  error?: boolean;
  meta?: Object;
};

type WithRequestId<T extends FSAction> = T & { meta: { requestId: number } };
