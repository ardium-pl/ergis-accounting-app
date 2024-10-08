export class SkippingIterator<T> {
  private index = 0;

  constructor(private objects: T[], private shouldSkipFn: (obj: T) => boolean) {}

  public next(): IteratorResult<T, T> {
    while (this.index < this.objects.length) {
      const currentObject = this.objects[this.index++];
      if (currentObject && !this.shouldSkipFn(currentObject)) {
        return { value: currentObject, done: false };
      }
    }
    return { value: undefined as any, done: true };
  }

  public hasNext(): boolean {
    for (let i = this.index; i < this.objects.length; i++) {
      if (this.objects[i] && !this.shouldSkipFn(this.objects[i])) {
        return true;
      }
    }
    return false;
  }

  public remaining(shouldSkip: boolean = true): T[] {
    if (!shouldSkip) return this.objects.slice(this.index);

    const remainingObjects: T[] = [];
    for (let i = this.index; i < this.objects.length; i++) {
      if (this.objects[i] && !this.shouldSkipFn(this.objects[i])) {
        remainingObjects.push(this.objects[i]);
      }
    }
    return remainingObjects;
  }
}
