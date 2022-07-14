import { useEffect } from "react";
import effectAsync from "./effectAsync";

export default function useAsyncEffect(
  asyncEffect: (
    stopped: () => boolean,
    cleanup: (onCleanup: () => void) => void
  ) => Promise<void> | void,
  dependencies?: React.DependencyList
): void {
  useEffect(() => effectAsync(asyncEffect), dependencies);
}
