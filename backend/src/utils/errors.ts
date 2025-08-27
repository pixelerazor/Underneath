export class CustomError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'CustomError';
  }
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}
