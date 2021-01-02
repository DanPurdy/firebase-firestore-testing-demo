const { setup, teardown } = require('../helpers');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Store delete rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to delete a staff record', async () => {
    const db = await setup(null, {
      'stores/ST00/staff/SM00': {
        name: 'test',
      },
    });

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').collection('staff').doc('SM00').delete(),
      ),
    );
  });

  test('fail when an authenticated user tries to delete a staff record', async () => {
    const db = await setup(
      { uid: 'test' },
      {
        'stores/ST00/staff/SM00': {
          name: 'test',
        },
      },
    );

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').collection('staff').doc('SM00').delete(),
      ),
    );
  });
});
