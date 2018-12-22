
import {mergeConfig} from '../../src/config'

describe('mergeConfig', () => {
  it('override properties', () => {
    const actual = mergeConfig({targetDirectory: 'hoge'})

    expect(actual).toMatchObject({
      targetDirectory: 'hoge'
    })
  })
})