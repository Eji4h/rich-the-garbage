export type ScoreObserver = (score: number) => void;

export class ObservableScore {
  private readonly observers: ScoreObserver[] = [];

  constructor(private _value: number = 0) {}

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    this._value = newValue;
    this.notifyObservers();
  }

  add(amount: number): void {
    this.value = this._value + amount;
  }

  subscribe(observer: ScoreObserver): () => void {
    this.observers.push(observer);
    // Immediately notify the new observer with current value
    observer(this._value);
    // Return unsubscribe function
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer: ScoreObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private notifyObservers(): void {
    this.observers.forEach((observer) => observer(this._value));
  }
}
