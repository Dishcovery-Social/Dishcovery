// A simple utility function to build an Express app for testing purposes. It takes a mount path and a router, and returns an Express app with the router mounted at the specified path.
import express, { type Express, type Router } from "express";

export const buildTestApp = (mountPath: string, router: Router): Express => {
  const app = express();
  app.use(express.json());
  app.use(mountPath, router);
  return app;
};
