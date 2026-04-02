import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";

interface ValidationSchemas {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(
            (issue) => `body.${issue.path.join(".")}: ${issue.message}`
          )
        );
      } else {
        req.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(
            (issue) => `params.${issue.path.join(".")}: ${issue.message}`
          )
        );
      } else {
        (req as any).params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(
            (issue) => `query.${issue.path.join(".")}: ${issue.message}`
          )
        );
      } else {
        // Overwrite query with parsed/coerced values
        (req as any).query = result.data;
      }
    }

    if (errors.length > 0) {
      throw ApiError.badRequest("Validation failed", errors);
    }

    next();
  };
};
