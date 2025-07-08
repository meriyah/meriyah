export function getOwnProperty<T>(object: Record<string | number, T>, key: string | number): T | undefined {
  return Object.hasOwn(object, key) ? object[key] : undefined;
}
