import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

const mockLogout = jest.fn<(callback: (err: unknown) => void) => void>();
const mockDestroy = jest.fn<(callback: (err: unknown) => void) => void>();
const mockClearCookie = jest.fn();
const mockSendStatus = jest.fn();
const mockNext = jest.fn() as unknown as NextFunction;

// Satisfy the named "env" export that authController imports
jest.unstable_mockModule("../../config/env.js", () => ({
  env: {},
}));

const { handleLogout } = await import("../../controllers/authController.js");

const mockReq = {
  logout: mockLogout,
  session: { destroy: mockDestroy },
} as unknown as Request;

const mockRes = {
  clearCookie: mockClearCookie,
  sendStatus: mockSendStatus,
} as unknown as Response;

afterEach(() => {
  jest.clearAllMocks();
});

describe("handleLogout", () => {
  it("clears the session cookie and returns 200 on success", () => {
    mockLogout.mockImplementation((callback) => callback(null));
    mockDestroy.mockImplementation((callback) => callback(null));

    handleLogout(mockReq, mockRes, mockNext);

    expect(mockClearCookie).toHaveBeenCalledWith("connect.sid");
    expect(mockSendStatus).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("calls next with the error and skips session destroy if logout fails", () => {
    const logoutError = new Error("Logout failed");
    mockLogout.mockImplementation((callback) => callback(logoutError));

    handleLogout(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(logoutError);
    expect(mockDestroy).not.toHaveBeenCalled();
    expect(mockSendStatus).not.toHaveBeenCalled();
  });

  it("calls next with the error and skips response if session destroy fails", () => {
    const sessionError = new Error("Session destroy failed");
    mockLogout.mockImplementation((callback) => callback(null));
    mockDestroy.mockImplementation((callback) => callback(sessionError));

    handleLogout(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(sessionError);
    expect(mockClearCookie).not.toHaveBeenCalled();
    expect(mockSendStatus).not.toHaveBeenCalled();
  });
});
