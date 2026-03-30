import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Closing server...`);
  server.close(async (err) => {
    if (err) {
      console.error("Error closing server", err);
      process.exit(1);
    }

    try {
      // Disconnect Prisma to release SQLite file locks
      await prisma.$disconnect();
      console.log("Prisma disconnected");
    } catch (e) {
      console.error("Error disconnecting Prisma", e);
    }

    console.log("Shutdown complete");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
