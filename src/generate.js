var crypto = require('crypto');

var self = module.exports;

// Generates a random number
var randomNumber = function(max) {
	// gives a number between 0 (inclusive) and max (exclusive)
	return crypto.randomBytes(1)[0] % max;
};

// Generate a random password.
self.generate = function(options) {
	// Set defaults.
	if (!options.hasOwnProperty('length')) options.length = 10;
	if (!options.hasOwnProperty('numbers')) options.numbers = false;
	if (!options.hasOwnProperty('symbols')) options.symbols = false;
	if (!options.hasOwnProperty('uppercase')) options.uppercase = true;
	if (!options.hasOwnProperty('excludeSimilarCharacters')) options.excludeSimilarCharacters = false;
	if (!options.hasOwnProperty('repeatCharactersLimit')) options.repeatCharactersLimit = 0;

	var lowercase = 'abcdefghijklmnopqrstuvwxyz',
		uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		numbers = '0123456789',
		symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~',
		similarCharacters = /[ilLI|`oO0]/g,
		repeatingCharacters = options.repeatCharactersLimit ? new RegExp('(.)\\1{' + (options.repeatCharactersLimit) + ',}', 'g') : undefined;

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
	while (password.length < options.length || (repeatingCharacters && repeatingCharacters.test(password))) {
		password += pool[randomNumber(pool.length)];

		// remove repeating characters if required
		if (repeatingCharacters) password = password.replace(repeatingCharacters, '');
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
