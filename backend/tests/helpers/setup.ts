// src/tests/helpers/setup.ts

import { resetDB } from './resetDb'
import { beforeEach } from 'vitest'

beforeEach(async () => {
  await resetDB()
})
