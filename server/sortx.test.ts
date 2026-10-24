import { describe, expect, it } from "vitest";
import { ALGORITHMS, parseCustomArray, runAlgorithm } from "../client/src/lib/algorithms";

describe("SortX algorithm engine", () => {
  it.each(ALGORITHMS.map(meta => meta.key))("sorts with %s", key => {
    const input = [45, 12, 78, 23, 9, 64, 31, 56, 18, 72, -4, 12];
    const result = runAlgorithm(input, key);
    expect(result.finalArray).toEqual([...input].sort((a, b) => a - b));
    expect(result.events.at(-1)?.type).toBe("COMPLETE");
  });

  it("validates custom array input", () => {
    expect(parseCustomArray("45, 12, -3").values).toEqual([45, 12, -3]);
    expect(parseCustomArray("not numbers").error).toContain("numbers");
    expect(parseCustomArray("").error).toContain("at least two");
  });
});
