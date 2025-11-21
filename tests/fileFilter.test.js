import { fileFilter } from "../app/modules/multerForAddCoffee.js";
import { jest } from "@jest/globals";

describe("fileFilter (Multer)", () => {
  test("accepte image/jpeg", () => {
    const file = { mimetype: "image/jpeg" };
    const cb = jest.fn();

    fileFilter({}, file, cb);

    expect(cb).toHaveBeenCalledWith(null, true);
  });

  test("refuse application/pdf", () => {
    const file = { mimetype: "application/pdf" };
    const cb = jest.fn();

    fileFilter({}, file, cb);

    const [err, allowed] = cb.mock.calls[0];
    expect(allowed).toBe(false);
    expect(err).toBeInstanceOf(Error);
  });
});
