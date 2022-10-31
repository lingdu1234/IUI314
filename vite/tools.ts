import { loadEnv } from 'vite'

export const getViteEnv = (mode: string, target: string) => {
  return loadEnv(mode, process.cwd())[target]
}
