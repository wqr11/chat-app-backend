export class AuthenticationError extends Error {
  constructor(msg: string) {
    super();
    this.name = "Authentication Error";
    this.message = msg;
  }
}

export class InternalServerError extends Error {
  constructor(msg: string) {
    super();
    this.name = "Internal Server Error";
    this.message = msg;
  }
}

export class SetCookiesError extends Error {
  constructor(msg: string) {
    super();
    this.name = "Set Cookies Error";
    this.message = msg;
  }
}

export class BadRequestError extends Error {
  constructor(msg: string) {
    super();
    this.name = "Bad Request";
    this.message = msg;
  }
}

export class NotFoundError extends Error {
  constructor(msg: string) {
    super();
    this.name = "Not found";
    this.message = msg;
  }
}
