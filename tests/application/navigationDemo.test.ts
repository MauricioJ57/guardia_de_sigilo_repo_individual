import { describe, expect, it } from "vitest";
import { cellKey, createGridMap, type GridPoint } from "../../src/domain/model/grid";
import { calculateRoute } from "../../src/application/simulation/navigationDemo";
import {
  UNIT_ENTRY_COST,
  type EntryCostProfile,
  type SearchResult,
} from "../../src/domain/navigation/search";

const START: GridPoint = { x: 0, y: 1 };
const GOAL: GridPoint = { x: 4, y: 1 };
const FREE_MAP = createGridMap(5, 3, []);

const EXPOSED_CELLS = new Set([
  cellKey({ x: 1, y: 1 }),
  cellKey({ x: 2, y: 1 }),
  cellKey({ x: 3, y: 1 }),
]);

const EXPOSED_PROFILE: EntryCostProfile = {
  baseCost: 1,
  penalty: 4,
  penalizedCells: EXPOSED_CELLS,
};

function stepsOf(result: SearchResult): number {
  return result.path.length - 1;
}

function bestCost(result: SearchResult): number {
  if (result.totalCost === null) {
    throw new Error("Expected a successful result with a cost.");
  }
  return result.totalCost;
}

function pathEntersExposed(result: SearchResult): boolean {
  return result.path.some((point) => EXPOSED_CELLS.has(cellKey(point)));
}

describe("calculateRoute consumer — exposed profile via configuration (B-03)", () => {
  it("gets the 6-step detour with the exposed profile (B-AC3)", () => {
    const result = calculateRoute(FREE_MAP, START, GOAL, "astar", EXPOSED_PROFILE);

    expect(result.algorithm).toBe("astar");
    expect(result.status).toBe("success");
    expect(stepsOf(result)).toBe(6);
    expect(bestCost(result)).toBe(6);
    expect(pathEntersExposed(result)).toBe(false);
  });

  it("keeps the unit result when the profile is deactivated (B-AC3)", () => {
    const withDefault = calculateRoute(FREE_MAP, START, GOAL, "astar");
    const withUnit = calculateRoute(FREE_MAP, START, GOAL, "astar", UNIT_ENTRY_COST);

    expect(withDefault).toEqual(withUnit);
    expect(stepsOf(withDefault)).toBe(4);
    expect(bestCost(withDefault)).toBe(4);
  });

  it("leaves BFS unweighted, ignoring the profile (C1)", () => {
    const result = calculateRoute(FREE_MAP, START, GOAL, "bfs", EXPOSED_PROFILE);

    expect(result.algorithm).toBe("bfs");
    expect(stepsOf(result)).toBe(4);
    expect(bestCost(result)).toBe(4);
  });
});
