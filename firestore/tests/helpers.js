const { apps, initializeTestApp, loadFirestoreRules } = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');

module.exports.setup = async (auth, data) => {
  const projectId = `rules-spec-${Date.now()}`;
  const app = await initializeTestApp({
    projectId,
    auth,
  });

  const db = app.firestore();

  // Apply the test rules so we can write documents without needing the admin app
  await loadFirestoreRules({
    projectId,
    rules: readFileSync('firestore/firestore-test.rules', 'utf8'),
  });

  // Write mock documents before rules
  if (data) {
    for (const key in data) {
      const ref = db.doc(key);
      await ref.set(data[key]);
    }
  }

  // Apply rules
  await loadFirestoreRules({
    projectId,
    rules: readFileSync('firestore/firestore.rules', 'utf8'),
  });

  return db;
};

module.exports.teardown = async () => {
  Promise.all(apps().map((app) => app.delete()));
};
