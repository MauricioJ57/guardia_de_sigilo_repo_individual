import type { GridMap, GridPoint } from "../../domain/model/grid";
import {
  findPathAStar,
  findPathBfs,
  UNIT_ENTRY_COST,
  type EntryCostProfile,
  type SearchAlgorithm,
  type SearchResult,
} from "../../domain/navigation/search";

export function calculateRoute(
  map: GridMap,
  start: GridPoint,
  goal: GridPoint,
  algorithm: SearchAlgorithm,
  profile: EntryCostProfile = UNIT_ENTRY_COST,
): SearchResult {
  return algorithm === "astar"
    ? findPathAStar(map, start, goal, profile)
    : findPathBfs(map, start, goal);
}
