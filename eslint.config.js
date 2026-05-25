// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    pnpm: true,
    rules: {
      'no-console': 'off',
      'ts/explicit-function-return-type': 'off',
      // pnpm 10 on CI doesn't always pick up onlyBuiltDependencies from
      // pnpm-workspace.yaml for the root package, so we keep it in package.json
      // and disable the lint rule that nags about it.
      'pnpm/json-prefer-workspace-settings': 'off',
      'jsonc/sort-keys': 'off',
    },
  },
)
