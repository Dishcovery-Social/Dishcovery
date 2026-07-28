// tests/testServer.ts
import express, { type Express, type Router } from "express";

export const buildTestApp = (mountPath: string, router: Router): Express => {
  const app = express();
  app.use(express.json());
  app.use(mountPath, router);
  return app;
};
