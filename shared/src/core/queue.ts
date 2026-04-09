export type Task<T> = () => Promise<T>;

export class RetryQueue {
  private readonly queue: Array<() => Promise<void>> = [];
  private inFlight = false;

  constructor(
    private readonly retries = 3,
    private readonly delayMs = 400
  ) {}

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        let attempt = 0;
        for (;;) {
          try {
            resolve(await task());
            return;
          } catch (error) {
            attempt += 1;
            if (attempt > this.retries) {
              reject(error);
              return;
            }
            await new Promise((r) => setTimeout(r, this.delayMs * attempt));
          }
        }
      });
      void this.drain();
    });
  }

  private async drain(): Promise<void> {
    if (this.inFlight) return;
    this.inFlight = true;
    while (this.queue.length) {
      const job = this.queue.shift();
      if (job) await job();
    }
    this.inFlight = false;
  }
}
