export type WebSocketAuthenticationResult =
  | {
      success: true;
      userId: string;
      token: string;
    }
  | {
      success: false;
    };
