export type CallbackType = () => void;

export class CallbackRegistry {
  private callbacks: Set<CallbackType> = new Set();
  private id : string

  constructor(id : string){
    this.id = id
  }

  subscribe(fn: CallbackType) {
    this.callbacks.add(fn);
  }

  unsubscribe(fn: CallbackType) {
    this.callbacks.delete(fn);
  }

  trigger() {
    this.callbacks.forEach((fn) => fn());
  }
}