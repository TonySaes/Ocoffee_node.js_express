import requireAdmin from "../app/middlewares/adminChecker.js";
import { jest } from "@jest/globals";

function mockRes() {
  return {
    redirect: jest.fn()
  };
}

describe("requireAdmin middleware", () => {
  test("redirige vers /admin/login si pas admin", () => {
    const req = { session: { isAdmin: false } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.redirect).toHaveBeenCalled();
    const url = res.redirect.mock.calls[0][0];
    expect(url).toContain("/admin/login");
    expect(next).not.toHaveBeenCalled();
  });

  test("laisse passer si admin", () => {
    const req = { session: { isAdmin: true } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
