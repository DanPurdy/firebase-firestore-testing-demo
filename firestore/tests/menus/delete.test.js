const { setup, teardown } = require('../helpers');
const { assertFails } = require('@firebase/rules-unit-testing');

describe('Menu delete rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to delete a menu record', async () => {
    const db = await setup(null, {
      'stores/ST00/menus/MU00': {
        id: 'test',
      },
    });

    expect(
      await assertFails(
        db.collection('stores').doc('test').collection('menus').doc('MU00').delete(),
      ),
    );
  });

  test('fail when an authenticated user tries to delete a menu record', async () => {
    const db = await setup(
      { uid: 'test' },
      {
        'stores/ST00/menus/MU00': {
          id: 'test',
        },
      },
    );

    expect(
      await assertFails(
        db.collection('stores').doc('test').collection('menus').doc('MU00').delete(),
      ),
    );
  });
});
