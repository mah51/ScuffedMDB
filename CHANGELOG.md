# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.1](https://github.com/mah51/scuffedmdb/compare/v0.3.0...v0.3.1) (2021-08-19)

## [0.3.0](https://github.com/mah51/scuffedmdb/compare/v0.2.1...v0.3.0) (2021-08-19)


### ⚠ BREAKING CHANGES

* **Customisation:** Almost every file affected

### Features

* **Customisation:** :sparkles: Change the accent colour of the website ([e67aa8d](https://github.com/mah51/scuffedmdb/commit/e67aa8d1c3dedd028143cbffdad7c7528b50b078))
* **HomePage:** :sparkles: Adding a hero with the active movie ([6205f4c](https://github.com/mah51/scuffedmdb/commit/6205f4cb01815fb9f87d60000b3d9f77153a09d7)), closes [#61](https://github.com/mah51/scuffedmdb/issues/61)


### Bug Fixes

* **SECURITY:** :bug: Removal of sensitive info such as client secret ([202d219](https://github.com/mah51/scuffedmdb/commit/202d2192a76c82771a1ade9047855bc5b3a3f141))
* **UserTableActions:** :bug: Fix logic in reveal modals ([c1eb0db](https://github.com/mah51/scuffedmdb/commit/c1eb0db5acc2619f68fcd3767f6c3054b122c001))


### Styling

* **ActiveHero:** :art: Changing layout to add header and footer buttons ([7617a1e](https://github.com/mah51/scuffedmdb/commit/7617a1e24c88d2a26cfdb01e29dc0d029d4ab1e3))


### Docs

* **README:** :pencil: Table for env variables ([48e0a6b](https://github.com/mah51/scuffedmdb/commit/48e0a6b41a9801bebd8c47b018784a088d34b483))

### [0.2.1](https://github.com/mah51/scuffedmdb/compare/v0.2.0...v0.2.1) (2021-08-18)


### Code Refactoring

* **MoviePage:** :recycle: Move check for user ban ([b26603f](https://github.com/mah51/scuffedmdb/commit/b26603fe48e1c8492528acf71e472e789e7caac2))
* **UserPage:** :recycle: user checks server side ([adeff79](https://github.com/mah51/scuffedmdb/commit/adeff79cf99554a961578b08c684bc4fca77d6e8))
* **UsersPage:** :recycle: refactoring user checking to serverside ([35b9a37](https://github.com/mah51/scuffedmdb/commit/35b9a372a111a5f30faffed6a8fc2bf5ca6e4c9c))
* **UsersPage:** :recycle: refactoring user checking to serverside ([e3cfa8e](https://github.com/mah51/scuffedmdb/commit/e3cfa8e26a84d50afc9dab1c262e324faa230b8c))

## [0.2.0](https://github.com/mah51/scuffedmdb/compare/v0.1.9...v0.2.0) (2021-08-18)


### ⚠ BREAKING CHANGES

* **User:** Affects user table actions, and next auth.

### Features

* **User:** :sparkles: Allow admins to hide users profile pictures ([44e03c4](https://github.com/mah51/scuffedmdb/commit/44e03c40dc3987405ed3f9ba6178285dabf4e637))


### Bug Fixes

* **HomePage:** :bug: Fix server side non serializable data ([0316cd2](https://github.com/mah51/scuffedmdb/commit/0316cd22afbc97f7497d92362510f6af41c20a25))

### [0.1.9](https://github.com/mah51/scuffedmdb/compare/v0.1.8...v0.1.9) (2021-08-18)


### Bug Fixes

* **AlertBanner:** :bug: prevent banner flash on page load if dismissed ([6de82e0](https://github.com/mah51/scuffedmdb/commit/6de82e09296b6a9f3781babed41faaa8ceeb3dd3))
* **Card:** :bug: load images with skeleton, to prevent flash of old image ([0661d6b](https://github.com/mah51/scuffedmdb/commit/0661d6bff20c8601727b8813583429e633bf6747))
* **Reviews:** :bug: prevent spilling of lists into left of document ([8f01f96](https://github.com/mah51/scuffedmdb/commit/8f01f96b6ae9194c8cd06055c0421b8bef48eea9)), closes [#56](https://github.com/mah51/scuffedmdb/issues/56)


### Docs

* **CONTRIBUTING:** :pencil: update ([5e3e083](https://github.com/mah51/scuffedmdb/commit/5e3e083e13c331a557ef7a89007299aef448cc84))


### Styling

* **commitzen:** :art: Modifying types ([64de518](https://github.com/mah51/scuffedmdb/commit/64de518b7109efa2838f15173097c13d66239454))
* **Release:** :art: Back to standard release, this seems easier ([98d6bbc](https://github.com/mah51/scuffedmdb/commit/98d6bbcb9bb593262ca2042360f838ac42c27890))

### [0.1.8](https://github.com/mah51/scuffedmdb/compare/v0.1.7...v0.1.8) (2021-08-18)

### [0.1.7](https://github.com/mah51/scuffedmdb/compare/v0.1.6...v0.1.7) (2021-08-18)

### [0.1.6](https://github.com/mah51/scuffedmdb/compare/v0.1.5...v0.1.6) (2021-08-18)


### Features

* **commitzen:** now without emoji :( ([e33569b](https://github.com/mah51/scuffedmdb/commit/e33569bfe743c60571546b4f80897d7874ad7a1b))

### [0.1.5](https://github.com/mah51/scuffedmdb/compare/v0.1.4...v0.1.5) (2021-08-18)

### [0.1.4](https://github.com/mah51/scuffedmdb/compare/v0.1.3...v0.1.4) (2021-08-18)

### [0.1.3](https://github.com/mah51/scuffedmdb/compare/v0.1.2...v0.1.3) (2021-08-18)

### 0.1.2 (2021-08-18)


### Features

* **BannerAlert:** displays if user does not have perms or is made reviewer and once closed does not show again, resolves [#48](https://github.com/mah51/scuffedmdb/issues/48) ([fb60703](https://github.com/mah51/scuffedmdb/commit/fb607036c375a992afa19aa7f0c210129a07ce3f))
* **changelog:** added a changelog to show when features are added or removed ([8c1a063](https://github.com/mah51/scuffedmdb/commit/8c1a0630288c9d24e54400940565d5d96d0f81bd))
* **Custom Error Page:** resolves [#49](https://github.com/mah51/scuffedmdb/issues/49) ([7e7f3f4](https://github.com/mah51/scuffedmdb/commit/7e7f3f4c5bd69618f1c4d041e2c85d7efa5fea17))
* **MoveDetailsSection:** Adding back to home button ([759b8e5](https://github.com/mah51/scuffedmdb/commit/759b8e528fcc0602e4e41cfa6cd01320203cee60))


### Bug Fixes

* **AlertBanner:** mobile formatting ([ee56738](https://github.com/mah51/scuffedmdb/commit/ee567388a55dc28178a3bde29db881b386a28475))
* **Movie Reviews:** fix for [#7](https://github.com/mah51/scuffedmdb/issues/7) ([79c7978](https://github.com/mah51/scuffedmdb/commit/79c7978576c102022798f0f90f283abae12eaa90))
* **MovieDetailsPage:** fixes flash of content on movie details ([ac915dd](https://github.com/mah51/scuffedmdb/commit/ac915dd307a7cf6163884404276442e029a7e99f))
* **MovieDetailsSection-IMDB button:** changed from the hanging yellow color, to IMDB brand colors (contrast is lacking so possible future change ([e129508](https://github.com/mah51/scuffedmdb/commit/e1295089524ea8da7de714b88c1914026aed4833))
* **ReviewModal:** movies not showing in select form ([7ae5c95](https://github.com/mah51/scuffedmdb/commit/7ae5c958989fde2474b4545ba812974ff8e53a84))
* **UserReviewSection:** stretching of movie images on long comments, resolves [#51](https://github.com/mah51/scuffedmdb/issues/51) ([3010ba6](https://github.com/mah51/scuffedmdb/commit/3010ba6fb6e2d0247f236114e58374f78c54f573))
* incorrect id checks ([1d266b1](https://github.com/mah51/scuffedmdb/commit/1d266b19d1c5d5a1699c5e823731982d35c9a8ba))
* mobile friendly movieModal ([baa0b9b](https://github.com/mah51/scuffedmdb/commit/baa0b9b7fe64d28e0ce7e9a0cff98d33f457eb9d))
* useMemo constantly re-rendering ([19e1f5e](https://github.com/mah51/scuffedmdb/commit/19e1f5eea1ff2962abdecfff6cdd2c4e61325072))

### [0.1.2](https://github.com/mah51/movie-web-typescript/compare/v0.1.1...v0.1.2) (2021-06-15)

### Features

- **changelog:** added a changelog to show when features are added or removed ([8c1a063](https://github.com/mah51/movie-web-typescript/commit/8c1a0630288c9d24e54400940565d5d96d0f81bd))

### 0.1.1 (2021-06-15)

### Bug Fixes

- **ReviewModal:** movies not showing in select form ([7ae5c95](https://github.com/mah51/movie-web-typescript/commit/7ae5c958989fde2474b4545ba812974ff8e53a84))
