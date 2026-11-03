import { describe, expect, it } from "vitest";
import { getHealth } from "./health";

describe("getHealth", () => {
  it("retorna status ok com o horário informado", () => {
    const now = new Date("2026-11-03T12:00:00Z");
    expect(getHealth(now)).toMatchObject({ status: "ok", time: "2026-11-03T12:00:00.000Z" });
  });
});
