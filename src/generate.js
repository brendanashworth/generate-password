var crypto = require('crypto');

var self = module.exports;

const RANDOM_BATCH_SIZE = 256;

var randomIndex;
var randomBytes;

var getNextRandomValue = function() {
	if (randomIndex === undefined || randomIndex >= randomBytes.length) {
		randomIndex = 0;
		randomBytes = crypto.randomBytes(RANDOM_BATCH_SIZE);
	}

	var result = randomBytes[randomIndex];
	randomIndex += 1;

	return result;
};

// Generates a random number
var randomNumber = function(max) {
	// gives a number between 0 (inclusive) and max (exclusive)
	var rand = getNextRandomValue();
	while (rand >= 256 - (256 % max)) {
		rand = getNextRandomValue();
	}
	return rand % max;
};

// Possible combinations
var lowercase = 'abcdefghijklmnopqrstuvwxyz',
	uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	numbers = '0123456789',
	symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~',
	similarCharacters = /[ilLI|`oO0]/g,
	strictRules = [
		{ name: 'lowercase', rule: /[a-z]/ },
		{ name: 'uppercase', rule: /[A-Z]/ },
		{ name: 'numbers', rule: /[0-9]/ },
		{ name: 'symbols', rule: /[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/ }
	];

var generate = function(options, pool) {
	var password = '',
		optionsLength = options.length,
		poolLength = pool.length;

	for (var i = 0; i < optionsLength; i++) {
		password += pool[randomNumber(poolLength)];
	}

	if (options.strict) {
		// Iterate over each rule, checking to see if the password works.
		var fitsRules = strictRules.every(function(rule) {
			// If the option is not checked, ignore it.
			if (options[rule.name] == false) return true;

			// Run the regex on the password and return whether
			// or not it matches.
			return rule.rule.test(password);
		});

		// If it doesn't fit the rules, generate a new one (recursion).
		if (!fitsRules) return generate(options, pool);
	}

	return password;
};

// Generate a random password.
self.generate = function(options) {
	// Set defaults.
	options = options || {};
	if (!Object.prototype.hasOwnProperty.call(options, 'length')) options.length = 10;
	if (!Object.prototype.hasOwnProperty.call(options, 'numbers')) options.numbers = false;
	if (!Object.prototype.hasOwnProperty.call(options, 'symbols')) options.symbols = false;
	if (!Object.prototype.hasOwnProperty.call(options, 'exclude')) options.exclude = '';
	if (!Object.prototype.hasOwnProperty.call(options, 'uppercase')) options.uppercase = true;
	if (!Object.prototype.hasOwnProperty.call(options, 'lowercase')) options.lowercase = true;
	if (!Object.prototype.hasOwnProperty.call(options, 'excludeSimilarCharacters')) options.excludeSimilarCharacters = false;
	if (!Object.prototype.hasOwnProperty.call(options, 'strict')) options.strict = false;

	if (options.strict) {
		var minStrictLength = 1 + (options.numbers ? 1 : 0) + (options.symbols ? 1 : 0) + (options.uppercase ? 1 : 0);
		if (minStrictLength > options.length) {
			throw new TypeError('Length must correlate with strict guidelines');
		}
	}

	// Generate character pool
	var pool = '';

	// lowercase
	if (options.lowercase) {
		pool += lowercase;
	}

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

	// Throw error if pool is empty.
	if (!pool) {
		throw new TypeError('At least one rule for pools must be true');
	}

	// similar characters
	if (options.excludeSimilarCharacters) {
		pool = pool.replace(similarCharacters, '');
	}

	// excludes characters from the pool
	var i = options.exclude.length;
	while (i--) {
		pool = pool.replace(options.exclude[i], '');
	}

	var password = generate(options, pool);

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
