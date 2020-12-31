const { setup, teardown } = require('../helpers');
const { assertFails } = require('@firebase/rules-unit-testing');

describe('Store delete rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to delete a store record', async () => {
    const db = await setup(null, {
      'stores/test': {
        name: 'test',
      },
    });

    expect(await assertFails(db.collection('stores').doc('test').delete()));
  });

  test('fail when an authenticated user tries to delete a store record', async () => {
    const db = await setup(
      { uid: 'test' },
      {
        'stores/test': {
          name: 'test',
        },
      },
    );

    expect(await assertFails(db.collection('stores').doc('test').delete()));
  });
});
