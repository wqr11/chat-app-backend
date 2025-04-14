export type WebSocketAuthenticationResult =
  | {
      success: true;
      userId: string;
    }
  | {
      success: false;
    };
