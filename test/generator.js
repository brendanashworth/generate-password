var assert = require('chai').assert,
	_ = require('underscore');

// We use a different require path for code coverage.
var generator = process.env.JSCOV ? require('../src-cov/generate') : require('../main');

describe('generate-password', function() {
	describe('generate()', function() {
		it('should accept to be called without the options parameter', function() {
			assert.doesNotThrow(function () {
				generator.generate();
			});
		});
		it('should give password of correct length', function() {
			var length = 12;

			var password = generator.generate({length: length});

			assert.equal(password.length, length);
		});

		it('should generate strict random sequence that is correct length', function() {
			var length = 12;

			var password = generator.generate({length: length, strict: true});

			assert.equal(password.length, length);
		});

		it('should remove possible similar characters from the sequences', function() {
			var password = generator.generate({length: 10000, excludeSimilarCharacters: true});

			assert.notMatch(password, /[ilLI|`oO0]/, 'password does not contain similar characters');
		});

		describe('strict mode', function() {
			// Testing randomly generated passwords and entropy isn't perfect,
			// thus in order to get a good sample of whether or not a rule
			// is passing correctly, we generate lots of passwords and check
			// each individually. If we're seeing spotty tests, this number should
			// be increased accordingly.
			var amountToGenerate = 500;

			it('should generate strict random sequence that has strictly at least one number', function() {
				var passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, uppercase: false, numbers: true});

				passwords.forEach(function(password) {
					assert.match(password, /[0-9]/, 'password has a number');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should generate strict random sequence that has strictly at least one lowercase letter', function() {
				var passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, uppercase: false});

				passwords.forEach(function(password) {
					assert.match(password, /[a-z]/, 'password has a lowercase letter');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should generate strict random sequence that has strictly at least one uppercase letter', function() {
				var passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, uppercase: true});

				passwords.forEach(function(password) {
					assert.match(password, /[A-Z]/, 'password has an uppercase letter');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should generate strict random sequence that has strictly at least one special symbol', function() {
				var passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, symbols: true});

				passwords.forEach(function(password) {
					assert.match(password, /[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/, 'password has a symbol');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should generate strict random sequence that avoids all excluded characters', function() {
				var passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, symbols: true, exclude: 'abcdefg+_-=}{[]|:;"/?.><,`~'});

				passwords.forEach(function(password) {
					assert.match(password, /[!@#$%^&*()]/, 'password uses normal symbols');
					assert.notMatch(password, /[abcdefg+_\-=}{[\]|:;"/?.><,`~]/, 'password avoids excluded characters from the full pool');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should generate strict random sequence that has has no lowercase letter', function () {
				var passwords = generator.generateMultiple(amountToGenerate, { length: 10, strict: true, lowercase: false });

				passwords.forEach(function (password) {
					assert.notMatch(password, /[a-z]/, 'password has no lowercase letters');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should generate strict random sequence that has strictly at least one lowercase, one symbol, and one uppercase letter', function () {
				var passwords = generator.generateMultiple(amountToGenerate, { length: 10, strict: true, uppercase: true, lowercase: true, symbols: true, numbers: true });

				passwords.forEach(function (password) {
					assert.match(password, /[a-z]/, 'password has a lowercase letter');
					assert.match(password, /[A-Z]/, 'password has a uppercase letter');
					assert.match(password, /[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/, 'password has a symbol');
					assert.match(password, /[0-9]/, 'password has a number');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should respect explicit list of symbols when provided', function() {
				var passwords = generator.generateMultiple(amountToGenerate, { length: 10, strict: true, symbols: '!', lowercase: true });

				passwords.forEach(function (password) {
					assert.notMatch(password, /[@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/, 'password does not have default symbols');
					assert.match(password, /[!]/, 'password has provided symbol');
				});
				assert.equal(passwords.length, amountToGenerate);
			});

			it('should throw an error if rules don\'t correlate with length', function() {
				assert.throws(function() {
					generator.generate({length: 2, strict: true, symbols: true, numbers: true});
				}, TypeError, 'Length must correlate with strict guidelines');
			});

			it('should throw an error if no rules are applied', function() {
				assert.throws(function() {
					generator.generate({ length: 10,  uppercase: false, lowercase: false, symbols: false, numbers: false });
				}, TypeError, 'At least one rule for pools must be true');
			});

			it('should generate short strict passwords without stack overflow', function(){
				assert.doesNotThrow(function() {
					generator.generate({length: 4, strict: true, uppercase: true, numbers: true, symbols: true});
				}, Error);
			});

			describe('configuration impossible', function() {
				it('should error on all numbers excluded but required', function() {
					assert.throws(function() {
						generator.generate({ strict: true, numbers: true, exclude: "1234567890"});
					}, TypeError, 'Configuration not possible');
				});

				it('should error on all symbols excluded but required', function() {
					assert.throws(function() {
						generator.generate({ strict: true, symbols: true, exclude: '!@#$%^&*()+_-=}{[]|:;"/?.><,`~'});
					}, TypeError, 'Configuration not possible');
				});

				it('should error on all uppercase excluded but required', function() {
					assert.throws(function() {
						generator.generate({ strict: true, uppercase: true, exclude: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'});
					}, TypeError, 'Configuration not possible');
				});

				it('should error on all lowercase excluded but required', function() {
					assert.throws(function() {
						generator.generate({ strict: true, lowercase: true, exclude: 'abcdefghijklmnopqrstuvwxyz'});
					}, TypeError, 'Configuration not possible');
				});
			});

		});
	});

	describe('generateMultiple()', function() {
		it('should accept to be called without the options parameter', function() {
			assert.doesNotThrow(function () {
				generator.generateMultiple(1);
			});
		});
		// should give right amount
		it('should give right amount of passwords', function() {
			var amount = 34;

			var passwords = generator.generateMultiple(amount);

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
