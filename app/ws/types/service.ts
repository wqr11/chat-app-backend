export type WsServiceResult =
  | {
      success: true;
      data: any;
    }
  | {
      success: false;
      error: unknown;
    };
