export class UpdateQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  async enqueue(updateFn) {
    this.queue.push(updateFn);
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  async processQueue() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const updateFn = this.queue.shift();
      await updateFn();
      // Small delay between updates if needed
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    this.isProcessing = false;
  }
}
