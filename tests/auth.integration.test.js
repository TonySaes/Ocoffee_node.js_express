import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("../app/models/users.models.js", () => ({
  default: {
    getUserByName: jest.fn(),
  },
}));

const usersModels = (await import("../app/models/users.models.js")).default;

const { default: app } = await import("../app.js");

describe("POST /admin/login (integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renvoie une redirection si login OK (session créée)", async () => {
    usersModels.getUserByName.mockResolvedValue({
      id: 1,
      username: "admin",
      password: "secret",
      is_admin: true,
    });

    const response = await request(app)
      .post("/admin/login")
      .type("form")
      .send({ username: "admin", password: "secret" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain("/admin");

    expect(usersModels.getUserByName).toHaveBeenCalledWith("admin");
  });

  test("refuse login si mauvais mot de passe", async () => {
    usersModels.getUserByName.mockResolvedValue({
      id: 1,
      username: "admin",
      password: "secret",
      is_admin: true,
    });

    const response = await request(app)
      .post("/admin/login")
      .type("form")
      .send({ username: "admin", password: "WRONG" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain("/admin/login?errorMessage");
  });

  test("refuse login si user inconnu", async () => {
    usersModels.getUserByName.mockResolvedValue(null);

    const response = await request(app)
      .post("/admin/login")
      .type("form")
      .send({ username: "toto", password: "x" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain("/admin/login?errorMessage");
  });
});
