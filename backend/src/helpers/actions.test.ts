import { parseActions, serializeActions } from "./actions.js";

describe("parseActions", () => {
  it("should parse a JSON string into an array", () => {
    expect(parseActions('["create-item","delete-item"]')).toEqual([
      "create-item",
      "delete-item",
    ]);
  });

  it("should return an empty array for empty JSON array string", () => {
    expect(parseActions("[]")).toEqual([]);
  });

  it("should handle a single action", () => {
    expect(parseActions('["view-item"]')).toEqual(["view-item"]);
  });
});

describe("serializeActions", () => {
  it("should serialize an array into a JSON string", () => {
    expect(serializeActions(["create-item", "delete-item"])).toBe(
      '["create-item","delete-item"]'
    );
  });

  it("should serialize an empty array", () => {
    expect(serializeActions([])).toBe("[]");
  });

  it("should handle a single action", () => {
    expect(serializeActions(["view-item"])).toBe('["view-item"]');
  });
});

describe("parseActions and serializeActions", () => {
  it("should be inverse operations", () => {
    const actions = ["create-item", "delete-item", "view-item"];
    expect(parseActions(serializeActions(actions))).toEqual(actions);
  });
});