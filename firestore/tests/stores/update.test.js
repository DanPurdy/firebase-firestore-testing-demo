const { setup, teardown } = require('../helpers');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Store update rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to update a store record', async () => {
    const db = await setup(null, {
      'stores/SH00': {
        name: 'test',
      },
    });

    expect(await assertFails(db.collection('stores').doc('SH00').set({ name: 'updated' })));
  });

  test('fail when an authenticated user with no stores tries to update a store record', async () => {
    const db = await setup(
      { uid: 'test' },
      {
        'stores/SH00': {
          name: 'test',
        },
      },
    );

    expect(await assertFails(db.collection('stores').doc('SH00').set({ name: 'updated' })));
  });

  test('fail when an authenticated user from another store tries to update a different store record', async () => {
    const db = await setup(
      { uid: 'test', stores: ['SH01'] },
      {
        'stores/SH00': {
          name: 'test',
        },
      },
    );

    expect(await assertFails(db.collection('stores').doc('SH00').set({ name: 'updated' })));
  });

  test('succeed when an authenticated user tries to update a store record to which they have access', async () => {
    const db = await setup(
      { uid: 'test', stores: ['SH00'] },
      {
        'stores/SH00': {
          name: 'test',
        },
      },
    );

    expect(await assertSucceeds(db.collection('stores').doc('SH00').set({ name: 'updated' })));
  });
});
