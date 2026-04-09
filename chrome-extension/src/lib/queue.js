export class RetryQueue {
  constructor(retries = 3, baseDelay = 500) {
    this.retries = retries;
    this.baseDelay = baseDelay;
    this.q = [];
    this.running = false;
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.q.push(async () => {
        for (let i = 0; i <= this.retries; i += 1) {
          try {
            resolve(await task());
            return;
          } catch (e) {
            if (i === this.retries) {
              reject(e);
              return;
            }
            await new Promise((r) => setTimeout(r, this.baseDelay * (i + 1)));
          }
        }
      });
      this.run();
    });
  }

  async run() {
    if (this.running) return;
    this.running = true;
    while (this.q.length) {
      await this.q.shift()();
    }
    this.running = false;
  }
}
