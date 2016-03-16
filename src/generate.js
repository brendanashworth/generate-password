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
  similarCharacters = /[ilLI|`oO0]/g,
  strictRules = [
    { name : "lowercase", rule : /[a-z]/ },
    { name : "uppercase", rule : /[A-Z]/ },
    { name : "numbers", rule : /[0-9]/ },
    { name : "symbols", rule : /[!|@#\$%\^&\*\(\)\+_\-=}\{\[]|\||:|;|"|\/|\?|\.|>|<|,|`|~]/ }
  ];

// Generate a random password.
self.generate = function(options) {
  // Set defaults.
  if (!options.hasOwnProperty('length')) options.length = 10;
  if (!options.hasOwnProperty('lowercase')) options.lowercase = true;
  if (!options.hasOwnProperty('numbers')) options.numbers = false;
  if (!options.hasOwnProperty('symbols')) options.symbols = false;
  if (!options.hasOwnProperty('uppercase')) options.uppercase = true;
  if (!options.hasOwnProperty('excludeSimilarCharacters')) options.excludeSimilarCharacters = false;
  if (!options.hasOwnProperty('strict')) options.strict = false;

  if(options.strict){
    var minStrictLength = 1 + (options.numbers ? 1 : 0) + (options.symbols ? 1 : 0) + (options.uppercase ? 1 : 0);
    if(minStrictLength > options.length){
      throw(new Error('Length should correlate with strict guidelines'));
    }
  }

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

  for (var i = 0; i < options.length; i++) {
    password += pool[randomNumber(pool.length)];
  }

  if(options.strict){

    var rulesApply = strictRules.reduce(function(result, rule){
      if(options[rule.name]){
        result = rule.rule.test(password);
      }
      return result;
    }, false);

    if(!rulesApply){
      password = self.generate(options);
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
