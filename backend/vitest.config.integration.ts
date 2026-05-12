// vitest.config.integration.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./tests/helpers/setup.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: ['src/**', 'tests/utils/**'],
    maxWorkers: 1,
    silent: true // if you want to see the errors, then comment this line out
  }
})

