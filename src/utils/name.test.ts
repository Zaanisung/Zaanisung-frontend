import { describe, expect, it } from "vitest";
import { firstName } from "./name";

describe("firstName", () => {
  it("returns the first name of a multi-word name", () => {
    expect(firstName("Aisha Mohammed")).toBe("Aisha");
    expect(firstName("Abena Serwaa Adom")).toBe("Abena");
  });

  it("collapses extra whitespace", () => {
    expect(firstName("  Aisha   Mohammed ")).toBe("Aisha");
  });

  it("returns the whole string for a single name", () => {
    expect(firstName("Zaanisung")).toBe("Zaanisung");
  });

  it("never throws and returns an empty string for missing names", () => {
    expect(firstName(undefined)).toBe("");
    expect(firstName(null)).toBe("");
    expect(firstName("")).toBe("");
    expect(firstName("   ")).toBe("");
  });
});