var crypto = require('crypto');

var self = module.exports;

// Generates a random number
var randomNumber = function(max) {
	// gives a number between 0 (inclusive) and max (exclusive)
	return crypto.randomBytes(1)[0] % max;
};

// Possible combinations
var lowercase = 'abcdefghijklmnopqrstuvwxyz',
  uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers = '0123456789',
  symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~',
  similarCharacters = /[ilLI|`oO0]/g;

// Generate a random password.
self.generate = function(options) {
	// Set defaults.
	if (!options.hasOwnProperty('length')) options.length = 10;
	if (!options.hasOwnProperty('numbers')) options.numbers = false;
	if (!options.hasOwnProperty('symbols')) options.symbols = false;
	if (!options.hasOwnProperty('uppercase')) options.uppercase = true;
	if (!options.hasOwnProperty('excludeSimilarCharacters')) options.excludeSimilarCharacters = false;
	if (!options.hasOwnProperty('strict')) options.strict = false;

	// Generate character pool
	var pool = lowercase;

	// uppercase
	if (options.uppercase) {
		pool += uppercase;
	}
	// numbers
	if (options.numbers) {
		pool += numbers;
	}
	// symbols
	if (options.symbols) {
		pool += symbols;
	}
	// similar characters
	if (options.excludeSimilarCharacters) {
		pool = pool.replace(similarCharacters, '');
	}

	var password = '';

	if(options.strict){
    var minStrictLength = (options.numbers ? 1 : 0) + (options.symbols ? 1 : 0) + (options.uppercase ? 1 : 0);
    if(minStrictLength > options.length){
      throw(new Error('Length should correlate with strict guidelines'));
    } else {
      var strictGroup = [];
      if (options.uppercase) {
        strictGroup.push(uppercase[randomNumber(uppercase.length)]);
      }
      // numbers
      if (options.numbers) {
        strictGroup.push(numbers[randomNumber(numbers.length)]);
      }
      // symbols
      if (options.symbols) {
        strictGroup.push(symbols[randomNumber(symbols.length)]);
      }

      for (var j = minStrictLength; j < options.length; j++) {
        strictGroup.push(pool[randomNumber(pool.length)]);
      }

      strictGroup.sort(function(){ return randomNumber(2) - 0.5;});
      password = strictGroup.join('');
    }

	} else {
		for (var i = 0; i < options.length; i++) {
			password += pool[randomNumber(pool.length)];
		}
	}

	return password;
};

// Generates multiple passwords at once with the same options.
self.generateMultiple = function(amount, options) {
	var passwords = [];

	for (var i = 0; i < amount; i++) {
		passwords[i] = self.generate(options);
	}

	return passwords;
};
