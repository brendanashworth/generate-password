Generate Password
=====
[![Build Status](https://travis-ci.org/brendanashworth/generate-password.svg?branch=master)](https://travis-ci.org/brendanashworth/generate-password)

[![Generate-Password NPM](https://nodei.co/npm/generate-password.png)](http://npmjs.org/package/generate-password)

> Generate-Password is a (relatively) extensive library for generating random and unique passwords.

### Install

```bash
$ npm install generate-password --save
```

### Usage
Generate one password.
```javascript
var generator = require('generate-password');

var password = generator.generate({
	length: 15,
	numbers: true
});

console.log(password); // Your unique password
```

Bulk generate multiple passwords.
```javascript
var generator = require('generate-password');

var passwords = generator.generateMultiple(10, {
	length: 15,
	symbols: true
});

// passwords is an array of 10 passwords now
```

### Available Options
Any of these can be passed into the options object for each function.


|            Name          |                  Description                | Default Value |
|--------------------------|---------------------------------------------|---------------|
| length                   | Integer, length of password.                |       10      |
| numbers                  | Boolean, put numbers in password.           |     false     |
| symbols                  | Boolean, put symbols in password.           |     false     |
| uppercase                | Boolean, use uppercase letters in password. |      true     |
| excludeSimilarCharacters | Excludes similar chars, like 'i' and 'l'.   |     false     |