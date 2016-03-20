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
		it('should generate strict random sequence that is correct length', function(){
			var length = 12;

			var password = generator.generate({length: length, strict : true});

			assert.equal(password.length, length);
		});

		it('should remove possible similar characters from the sequences', function(){
			var password = generator.generate({length: 10000, excludeSimilarCharacters : true});

			assert.equal(/[ilLI|`oO0]/.test(password), false);
		});

		it('should generate strict random sequence that has strictly at least one number', function(){
			var hasNumber = /[0-9]/;

			var password = generator.generate({length: 12, strict : true, uppercase : false, numbers : true});

			assert.equal(hasNumber.test(password), true);
		});

		it('should generate strict random sequence that has strictly at least one lowercase letter', function(){
			var hasLowerCaseLetters = /[a-z]/;

			var password = generator.generate({length: 1, strict : true, uppercase : false});

			assert.equal(hasLowerCaseLetters.test(password), true);
		});

		it('should generate strict random sequence that has strictly at least one uppercase letter', function(){
			var hasUpperCaseLetters = /[A-Z]/;

			var password = generator.generate({length: 12, strict : true, uppercase : true});

			assert.equal(hasUpperCaseLetters.test(password), true);
		});

		it('should generate strict random sequence that has strictly at least one special symbol', function(){
			var hasSymbols = /(!|@|#|\$|%|\^|&|\*|\(|\)|\+|_|\-|=|}|\{|\[|]|\||:|;|"|\/|\?|\.|>|<|,|`|~|)/;

			var password = generator.generate({length: 12, strict : true, symbols : true});
			assert.equal(hasSymbols.test(password), true);
		});

		it('should throw an error if rules don\'t correlate with length', function(){
			var methodThatThrows = generator.generate.bind(generator, {length: 2, strict : true, symbols : true, numbers : true});
			assert.throws(methodThatThrows, Error, 'Length should correlate with strict guidelines');
		});

		it('should generate short strict passwords without stack overflow', function(){
			var passwordGen = generator.generate.bind(generator, {length: 4, strict : true, uppercase : true, numbers : true, symbols : true});
			assert.doesNotThrow(passwordGen, Error);
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