export const enum Features {
  None = 0,
  Decorators = 1 << 0,
  ImportDefer = 1 << 1,
  ImportSource = 1 << 2,
}

export const nextFeatures = Features.Decorators | Features.ImportDefer | Features.ImportSource;
