import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { authenticate } from "../../middleware/authenticate.js";

const mockIsAuthenticated = jest.fn<() => boolean>();
const mockStatus = jest.fn();
const mockJson = jest.fn();
const mockNext = jest.fn() as unknown as NextFunction;

const mockReq = {
  isAuthenticated: mockIsAuthenticated,
} as unknown as Request;

const mockRes = {
  status: mockStatus.mockReturnValue({ json: mockJson }),
} as unknown as Response;

afterEach(() => {
  jest.clearAllMocks();
});

describe("authenticate", () => {
  it("calls next if the user is authenticated", () => {
    mockIsAuthenticated.mockReturnValue(true);

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it("returns 401 if the user is not authenticated", () => {
    mockIsAuthenticated.mockReturnValue(false);

    authenticate(mockReq, mockRes, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
