import { jest } from "@jest/globals";

const mockQuery = jest.fn();

// mock du client PG
await jest.unstable_mockModule("../app/models/db.js", () => ({
  default: { query: mockQuery }
}));

const coffeeModels = (await import("../app/models/coffee.models.js")).default;

describe("coffeeModels.createCoffee", () => {
  test("insère un café et retourne l'id", async () => {
    mockQuery.mockResolvedValue({ rows: [{ coffee_id: 42 }] });

    const id = await coffeeModels.createCoffee({
      name: "Test",
      description: "Desc",
      price: 10,
      reference: "REF1",
      country_id: 1
    });

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(id).toBe(42);
  });
});
