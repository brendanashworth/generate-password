var assert = require('chai').assert,
	_ = require('underscore');

var generator = require('../main');

describe('generate-password', function() {
	describe('generate()', function() {
		it('should give password of correct length', function() {
			var length = 12;

			var password = generator.generate({length: length});

			assert.equal(password.length, length);
		});
	});

	describe('generateMultiple()', function() {
		// should give right amount
		it('should give right amount of passwords', function() {
			var amount = 34;

			var passwords = generator.generateMultiple(amount, {});

			assert.equal(passwords.length, amount);
		});

		// shouldn't give duplicates in pool of 250 (extremely rare)
		it('should not give duplicates in pool', function() {
			var passwords = generator.generateMultiple(250, {length: 10, numbers: true, symbols: true});

			var unique = _.uniq(passwords);
			assert.equal(unique.length, passwords.length);
		});
	});
});