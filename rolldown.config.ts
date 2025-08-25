import { defineConfig } from 'rolldown'
import { createReactConfig, createVueConfig } from './rolldown/configs'

export default defineConfig([
  ...createReactConfig(),
  ...createVueConfig(),
])
