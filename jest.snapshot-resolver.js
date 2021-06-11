module.exports = {
  testPathForConsistencyCheck: 'Rating/Rating.test.tsx',

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    `${testPath}${snapshotExtension}`,

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace(new RegExp(`${snapshotExtension}$`), ''),
};
