import { string } from 'yup/lib/locale';

export class AppError {
  public readonly success: boolean;

  public readonly message: string;

  public readonly statusCode: number;

  constructor(success: false, message: string, statusCode: number) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
  }
}
