export type CkusroConfig = {
  targetDirectory: string
}

const defaultConfig: CkusroConfig = {
  targetDirectory: '../trapahi/wiki'
}

export function mergeConfig(conf: Partial<CkusroConfig>): CkusroConfig{
  return {...defaultConfig, ...conf}
}