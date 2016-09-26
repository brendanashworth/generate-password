# 1.2.0 / 2016-9-25
Release with a new feature and various improvements.

`strict` is now an option that can be passed to password generation. When this is `true`,
each other option will be required — for example, if you generate a password with numbers,
lowercase letters, and uppercase letters, the password will have *at least one* number, one
lowercase letter, and one uppercase letter.

#### Notable Changes
- [`98f923c0c`](https://github.com/brendanashworth/generate-password/commit/98f923c0c9af4fd7f3010b3d40c85233de437eef) - fix strict password generation (Brendan Ashworth)
- [`c69e2ef6b`](https://github.com/brendanashworth/generate-password/commit/c69e2ef6bb876ba58e6b27bc1f460d6ff18cb877) - adds eslint (Brendan Ashworth)
- [`a798e846c`](https://github.com/brendanashworth/generate-password/commit/a798e846c70210f6c88cbc062d8f1d4f8b808f8b) - add code coverage (Brendan Ashworth)
- [`aa5e13edf`](https://github.com/brendanashworth/generate-password/commit/aa5e13edfee35852fb3a31414cbf2e8fa101e257) - Adds strict password generation (Algimantas Krasauskas)

# 1.1.1 / 2014-12-23
- Add `excludeSimilarCharacters` option