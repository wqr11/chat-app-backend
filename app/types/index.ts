export type ServiceResult = {
  success: boolean;
  code: number;
  data: any;
};

export type LoginServiceResult = { code: number } & (
  | {
      success: true;
      data: {
        access: string;
        refresh: string;
      };
    }
  | {
      success: false;
      error: unknown;
    }
);

export type RefreshTokensResult =
  | {
      success: true;
      data: {
        email: string;
        access: string;
        refresh: string;
      };
    }
  | {
      success: false;
      error: unknown;
    };
