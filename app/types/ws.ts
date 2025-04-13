export enum EVENT_TYPE {
  CREATE,
  GET,
  UPDATE,
  DELETE,
}

export enum OBJECT_TYPE {
  CHAT,
  MESSAGE,
}

export interface ClientMessageType {
  event: EVENT_TYPE;
  object: OBJECT_TYPE;
  object_id: string;
}

export interface ClientAuthMessageType {
  accessToken: string;
}
