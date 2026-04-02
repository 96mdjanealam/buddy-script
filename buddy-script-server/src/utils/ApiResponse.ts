import type { Response } from "express";

interface ApiResponseData<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export class ApiResponse {
  static send<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T
  ): Response {
    const responseBody: ApiResponseData<T> = {
      success: statusCode < 400,
      statusCode,
      message,
      data,
    };
    return res.status(statusCode).json(responseBody);
  }

  static success<T>(res: Response, message: string, data: T): Response {
    return ApiResponse.send(res, 200, message, data);
  }

  static created<T>(res: Response, message: string, data: T): Response {
    return ApiResponse.send(res, 201, message, data);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
