export class RateLimiter {
  constructor(perMinute) {
    this.perMinute = perMinute;
    this.history = [];
  }

  async wait() {
    for (;;) {
      const now = Date.now();
      this.history = this.history.filter((x) => now - x < 60000);
      if (this.history.length < this.perMinute) {
        this.history.push(now);
        return;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}
