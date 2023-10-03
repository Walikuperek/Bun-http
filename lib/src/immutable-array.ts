export class ImmutableArr<T> extends Array<T> {
  constructor(...args: T[]) {
    super(...args.map((e) => Object.assign({}, e)));
  }

  override push(...args: T[]) {
    return super.push(...args.map((e) => Object.assign({}, e)));
  }

  override unshift(...args: T[]) {
    return super.unshift(...args.map((e) => Object.assign({}, e)));
  }
}
