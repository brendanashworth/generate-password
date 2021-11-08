import chai from 'chai';
import { generate, generateMultiple } from 'generate-password';

const { assert } = chai;

describe('generate-password', function() {
	describe('import()', function() {
		it('should correctly import with named exports', function() {
			assert.isFunction(generate);
			assert.isFunction(generateMultiple);
		});
	});
});
