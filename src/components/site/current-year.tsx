"use client";

import { useSyncExternalStore } from "react";

const buildYear = new Date().getFullYear();
const subscribe = () => () => {};

/**
 * Copyright year. The static HTML carries the build year; the browser swaps in
 * the current one, so the footer stays right without a rebuild.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  return <>{year}</>;
}
