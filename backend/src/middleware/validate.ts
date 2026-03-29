import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      res.status(400).json({ error: errors[0] });
      return;
    }

    req.body = result.data;
    next();
  };

export const validateParams =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0]?.message,
      });
    }

    req.params = result.data as unknown as Record<string, string>; // validated + sanitized
    next();
  };
