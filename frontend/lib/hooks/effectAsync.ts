export default function effectAsync(
  task: (
    stopped: () => boolean,
    cleanup: (onCleanup: () => void) => void
  ) => Promise<void> | void
): ReturnType<React.EffectCallback> {
  let stopped = false;
  let customCleanup: (() => void) | null = null;

  task(
    () => stopped,
    (onCleanup) => {
      customCleanup = onCleanup;
    }
  );

  return function cancel() {
    stopped = true;
    if (customCleanup !== null) {
      customCleanup();
    }
  };
}
