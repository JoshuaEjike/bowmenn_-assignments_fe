import type { PaginatedResult } from "@/app/types/domain";

/** Simulates realistic network latency so loading states are visible during development. */
export function mockDelay(ms = 500 + Math.random() * 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Deterministic pseudo-random failure, used to exercise error states without being flaky per-run. */
export function maybeFail(failureRate = 0): void {
  if (failureRate > 0 && Math.random() < failureRate) {
    throw {
      message: "The server could not process this request. Please try again.",
      code: "MOCK_SERVER_ERROR",
      status: 500,
    };
  }
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export function paginate<T>(items: T[], { page, pageSize }: PageParams): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems,
    totalPages,
  };
}

export function matchesSearch(haystack: string[], query: string | undefined): boolean {
  if (!query?.trim()) return true;
  const needle = query.trim().toLowerCase();
  return haystack.some((field) => field.toLowerCase().includes(needle));
}

let idCounter = 1000;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter}`;
}
