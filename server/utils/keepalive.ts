import type { H3Event } from "h3";

/**
 * Creates a keep-alive mechanism to prevent inactivity timeouts during long operations.
 * Logs progress messages at regular intervals.
 */
export class KeepAlive {
  private interval: NodeJS.Timeout | null = null;
  private lastLog = 0;
  private startTime = Date.now();

  constructor(
    private event: H3Event,
    private intervalMs = 10000,
  ) {}

  /**
   * Log progress update
   */
  progress(message: string) {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    console.log(`[KeepAlive] ${message} (${elapsed}s elapsed)`);
  }

  /**
   * Start sending keep-alive signals
   */
  start(message = "Processing...") {
    console.log(`[KeepAlive] Started: ${message}`);
    this.lastLog = Date.now();

    this.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      console.log(`[KeepAlive] Still processing... (${elapsed}s elapsed)`);
    }, this.intervalMs);
  }

  /**
   * Stop the keep-alive mechanism
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    console.log(`[KeepAlive] Completed (${elapsed}s total)`);
  }
}

/**
 * Creates a keep-alive instance for an event handler.
 * Automatically starts logging and cleans up when the promise settles.
 */
export function withKeepAlive<T>(
  event: H3Event,
  operation: (keepalive: KeepAlive) => Promise<T>,
  startMessage = "Processing request...",
): Promise<T> {
  const keepalive = new KeepAlive(event);
  keepalive.start(startMessage);

  return operation(keepalive).finally(() => {
    keepalive.stop();
  });
}
