import { describe, expect, it } from "vitest";
import { cellKey, createGridMap, type GridPoint } from "../../src/domain/model/grid";
import {
  findPathAStar,
  findPathBfs,
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

const NO_PENALTY_PROFILE: EntryCostProfile = {
  baseCost: 1,
  penalty: 0,
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

const DIRECT_ROUTE: readonly GridPoint[] = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
];

function directRouteCost(profile: EntryCostProfile): number {
  return DIRECT_ROUTE.slice(1).reduce((total, point) => {
    const cellCost = profile.baseCost
      + (profile.penalizedCells.has(cellKey(point)) ? profile.penalty : 0);
    return total + cellCost;
  }, 0);
}

describe("zones exposed — fixed 5x3 fixture (B)", () => {
  it("keeps the unit behaviour when no profile is given (B-02)", () => {
    const astar = findPathAStar(FREE_MAP, START, GOAL);
    const withUnit = findPathAStar(FREE_MAP, START, GOAL, UNIT_ENTRY_COST);
    const bfs = findPathBfs(FREE_MAP, START, GOAL);

    expect(astar).toEqual(withUnit);
    expect(astar.status).toBe("success");
    expect(stepsOf(astar)).toBe(4);
    expect(bestCost(astar)).toBe(4);
    expect(stepsOf(bfs)).toBe(4);
    expect(bestCost(bfs)).toBe(4);
  });

  it("charges 16 to the direct route and prefers a 6-step detour with cost 6 (B-01, B-AC1)", () => {
    const result = findPathAStar(FREE_MAP, START, GOAL, EXPOSED_PROFILE);

    expect(directRouteCost(EXPOSED_PROFILE)).toBe(16);
    expect(result.status).toBe("success");
    expect(stepsOf(result)).toBe(6);
    expect(bestCost(result)).toBe(6);
    expect(pathEntersExposed(result)).toBe(false);
  });

  it("stops avoiding the strip when the penalty is zero (B-04, B-AC2)", () => {
    const result = findPathAStar(FREE_MAP, START, GOAL, NO_PENALTY_PROFILE);

    expect(directRouteCost(NO_PENALTY_PROFILE)).toBe(4);
    expect(result.status).toBe("success");
    expect(stepsOf(result)).toBe(4);
    expect(bestCost(result)).toBe(4);
  });
});
