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

			// Treat symbol differently if explicit string is provided
			if (rule.name === 'symbols' && typeof options[rule.name] === 'string') {
				// Create a regular expression from the provided symbols
				var re = new RegExp('['+options[rule.name]+']');
				return re.test(password);
			}

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

	var innerOptions = {...options};

	// Set defaults.
	innerOptions = innerOptions || {};
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'length')) innerOptions.length = 10;
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'numbers')) innerOptions.numbers = false;
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'symbols')) innerOptions.symbols = false;
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'exclude')) innerOptions.exclude = '';
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'uppercase')) innerOptions.uppercase = true;
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'lowercase')) innerOptions.lowercase = true;
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'excludeSimilarCharacters')) innerOptions.excludeSimilarCharacters = false;
	if (!Object.prototype.hasOwnProperty.call(innerOptions, 'strict')) innerOptions.strict = false;

	if (innerOptions.strict) {
		var minStrictLength = 1 + (innerOptions.numbers ? 1 : 0) + (innerOptions.symbols ? 1 : 0) + (innerOptions.uppercase ? 1 : 0);
		if (minStrictLength > innerOptions.length) {
			throw new TypeError('Length must correlate with strict guidelines');
		}
	}

	// Generate character pool
	var pool = '';

	// lowercase
	if (innerOptions.lowercase) {
		pool += lowercase;
	}

	// uppercase
	if (innerOptions.uppercase) {
		pool += uppercase;
	}
	// numbers
	if (innerOptions.numbers) {
		pool += numbers;
	}
	// symbols
	if (innerOptions.symbols) {
		if (typeof innerOptions.symbols === 'string') {
			pool += innerOptions.symbols;
		} else {
			pool += symbols;
		}
	}

	// Throw error if pool is empty.
	if (!pool) {
		throw new TypeError('At least one rule for pools must be true');
	}

	// similar characters
	if (innerOptions.excludeSimilarCharacters) {
		pool = pool.replace(similarCharacters, '');
	}

	// excludes characters from the pool
	var i = innerOptions.exclude.length;
	while (i--) {
		pool = pool.replace(innerOptions.exclude[i], '');
	}

	var password = generate(innerOptions, pool);

	return password;
};

// Generates multiple passwords at once with the same options.
self.generateMultiple = function(amount, options) {
	var passwords = [];
	var innerOptions = {...options};

	for (var i = 0; i < amount; i++) {
		passwords[i] = self.generate(innerOptions);
	}

	return passwords;
};
