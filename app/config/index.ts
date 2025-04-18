export const REDIS_URL = process.env.REDIS_URL!;

export const PORT = parseInt(process.env.PORT!);
export const WS_PORT = parseInt(process.env.WS_PORT!);

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_ACCESS_EX = parseInt(process.env.JWT_ACCESS_EX!); // in seconds
export const JWT_REFRESH_EX = parseInt(process.env.JWT_REFRESH_EX!);

export const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE!;
export const REFRESH_TOKEN_COOKIE = process.env.REFRESH_TOKEN_COOKIE!;

export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS!);

export const WS_PING_INTERVAL = parseInt(process.env.WS_PING_INTERVAL!); // in ms;
