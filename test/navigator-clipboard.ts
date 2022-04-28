import {clipboardRead, clipboardWrite, apply, isPolyfilled, isSupported} from '../lib/navigator-clipboard.js'

describe('navigator clipboard', () => {
  it('has standard isSupported, isPolyfilled, apply API', () => {
    expect(isSupported).to.be.a('function')
    expect(isPolyfilled).to.be.a('function')
    expect(apply).to.be.a('function')
    expect(isSupported()).to.be.a('boolean')
    expect(isPolyfilled()).to.equal(false)
  })

  describe('read', () => {
    it('read returns array of 1 clipboard entry with plaintext of readText value', () => {
      navigator.clipboard.readText = () => Promise.resolve('foo')
      const arr = await clipboardRead()
      expect(arr).to.have.lengthOf(1)
      expect(arr[0]).to.be.an.instanceof(ClipboardItem)
      expect(arr[0].types).to.eql(['text/plain'])
      expect(await arr[0].getType('text/plain')).to.eql('foo')
    })
  })

  describe('write', () => {
    it('unpacks text/plain content to writeText', () => {
      const calls = []
      navigator.clipboard.writeText = (...args) => calls.push(args)
      await clipboardWrite(
        new ClipboardItem({
          'foo/bar': 'horrible',
          'text/plain': Promise.resolve('foo')
        })
      )
      expect(calls).to.have.lengthOf(1)
      expect(calls[0]).to.eql(['foo'])
    })
  })
})
