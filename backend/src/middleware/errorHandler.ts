// import type { Request, Response, NextFunction } from "express";
// import { Prisma } from "../generated/prisma/client.js";

// export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
//   console.error(err);

//   if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     if (err.code === "P2002") {
//       return res.status(409).json({ error: "A user with this email already exists" });
//     }

//     // Prisma record not found
//     if (err.code === "P2025") {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     }
//   }

//   // Prisma unique constraint error
// //   if (err.code === "P2002") {
// //     return res.status(409).json({
// //       error: "A user with this email already exists",
// //     });
// //   }

//   // Zod validation errors
//   if (err.name === "ZodError") {
//     return res.status(400).json({
//       error: err.errors?.[0]?.message || "Invalid input",
//     });
//   }

//   // Default fallback
//   res.status(500).json({
//     error: "An unexpected error occurred",
//   });
// }
import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  // Prisma unique constraint
  if (err?.code === "P2002") {
    return res.status(409).json({
      error: "A user with this email already exists",
    });
  }

  // Prisma record not found
  if (err?.code === "P2025") {
    return res.status(404).json({
      error: "User not found",
    });
  }

  // Zod validation
  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: err.errors?.[0]?.message || "Invalid input",
    });
  }

  return res.status(500).json({
    error: "An unexpected error occurred",
  });
}
