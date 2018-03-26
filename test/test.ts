import { Foo } from '..'

import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('test', () => {
	it('returns five', () => {
		expect(Foo.bar()).to.equal(5);
	})
})
