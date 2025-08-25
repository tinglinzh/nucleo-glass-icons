// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    pnpm: true,
    rules: {
      'no-console': 'off',
      'ts/explicit-function-return-type': 'off',
    },
  },
)
