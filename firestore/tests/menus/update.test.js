const { setup, teardown } = require('../helpers');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Store menu update rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to create a menu record', async () => {
    const db = await setup(null, {
      'stores/ST00/menus/MU00': {
        name: 'test',
      },
    });

    expect(
      await assertFails(
        db
          .collection('stores')
          .doc('ST00')
          .collection('menus')
          .doc('MU00')
          .set({ name: 'updated' }),
      ),
    );
  });

  test('fail when a authenticated store admin from a different store tries to update a menu record', async () => {
    const db = await setup(
      { uid: 'test', stores: ['ST01'] },
      {
        'stores/ST00/menus/MU00': {
          name: 'test',
        },
      },
    );

    expect(
      await assertFails(
        db
          .collection('stores')
          .doc('ST00')
          .collection('menus')
          .doc('MU00')
          .set({ name: 'updated' }),
      ),
    );
  });

  test('succeed when a authenticated store admin from the same store tries to update a menu record', async () => {
    const db = await setup(
      { uid: 'test', stores: ['ST00'] },
      {
        'stores/ST00/menus/MU00': {
          name: 'test',
        },
      },
    );

    expect(
      await assertSucceeds(
        db
          .collection('stores')
          .doc('ST00')
          .collection('menus')
          .doc('MU00')
          .set({ name: 'updated' }),
      ),
    );
  });
});
