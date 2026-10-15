import { describe, expect, it } from "vitest";
import { createGridMap, isWalkable, type GridPoint } from "../../src/domain/model/grid";
import { findPathAStar, findPathBfs, type SearchResult } from "../../src/domain/navigation/search";

const START: GridPoint = { x: 0, y: 1 };
const GOAL: GridPoint = { x: 4, y: 1 };

const FREE_MAP = createGridMap(5, 3, []);
const BARRIER_MAP = createGridMap(5, 3, [
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
]);

function stepsOf(result: SearchResult): number {
  return result.path.length - 1;
}

function isCardinalStep(from: GridPoint, to: GridPoint): boolean {
  return Math.abs(to.x - from.x) + Math.abs(to.y - from.y) === 1;
}

describe.each([
  ["BFS", findPathBfs],
  ["A*", findPathAStar],
] as const)("common fixture 5x3 — %s", (_name, findPath) => {
  it("returns a cardinal 4-step route with cost 4", () => {
    const result = findPath(FREE_MAP, START, GOAL);

    expect(result.status).toBe("success");
    expect(result.path[0]).toEqual(START);
    expect(result.path.at(-1)).toEqual(GOAL);
    expect(result.path.every((point) => isWalkable(FREE_MAP, point))).toBe(true);
    expect(stepsOf(result)).toBe(4);
    expect(result.totalCost).toBe(4);
    expect(result.expandedNodes).toBeGreaterThan(0);
    expect(result.maximumFrontier).toBeGreaterThan(0);
    for (let index = 1; index < result.path.length; index += 1) {
      expect(isCardinalStep(result.path[index - 1] ?? START, result.path[index] ?? GOAL)).toBe(true);
    }

    console.log(
      `[fixture-comun] ${result.algorithm} status=${result.status} pasos=${stepsOf(result)} `
      + `costo=${result.totalCost} expandidos=${result.expandedNodes} `
      + `fronteraMaxima=${result.maximumFrontier} ruta=${result.path.map((p) => `(${p.x},${p.y})`).join("->")}`,
    );
  });

  it("treats start equal to goal as success with cost 0", () => {
    const result = findPath(FREE_MAP, START, START);

    expect(result.status).toBe("success");
    expect(result.path).toEqual([START]);
    expect(stepsOf(result)).toBe(0);
    expect(result.totalCost).toBe(0);
    expect(result.expandedNodes).toBe(1);
    expect(result.maximumFrontier).toBe(1);
  });

  it("reports a free but unreachable goal as unreachable", () => {
    const result = findPath(BARRIER_MAP, START, GOAL);

    expect(isWalkable(BARRIER_MAP, GOAL)).toBe(true);
    expect(result.status).toBe("unreachable");
    expect(result.path).toEqual([]);
    expect(result.totalCost).toBeNull();
  });

  it("reports endpoints outside the map as invalid", () => {
    const invalidStart = findPath(FREE_MAP, { x: -1, y: 1 }, GOAL);
    const invalidGoal = findPath(FREE_MAP, START, { x: 5, y: 1 });

    expect(invalidStart.status).toBe("invalid-start");
    expect(invalidGoal.status).toBe("invalid-goal");
    expect(invalidStart.expandedNodes).toBe(0);
    expect(invalidGoal.expandedNodes).toBe(0);
  });
});
