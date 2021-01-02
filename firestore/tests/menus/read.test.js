const { setup, teardown } = require('../helpers');
const { assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Menu read rules', () => {
  describe('list', () => {
    afterAll(async () => {
      await teardown();
    });

    test('succeed when a non authenticated user tries to load a list of menus', async () => {
      const db = await setup(null, {
        'stores/ST01/menus/MU00': {
          id: 'test',
        },
      });
      const ref = db.collection('stores').doc('ST01');

      expect(await assertSucceeds(ref.collection('menus').get()));
    });

    test('succeed when a authenticated user tries to load a list of menus', async () => {
      const db = await setup(
        {
          uid: 'user',
        },
        {
          'stores/ST01/menus/MU00': {
            id: 'test',
          },
        },
      );
      const ref = db.collection('stores').doc('ST01');

      expect(await assertSucceeds(ref.collection('menus').get()));
    });
  });

  describe('get', () => {
    afterAll(async () => {
      await teardown();
    });

    test('succeed when a non authenticated user tries to get a menu', async () => {
      const db = await setup(null, {
        'stores/ST01/menus/MU00': {
          id: 'test',
        },
      });
      const ref = db.collection('stores').doc('ST01');

      expect(await assertSucceeds(ref.collection('menus').doc('MU00').get()));
    });

    test('succeed when a authenticated user tries to get a menu', async () => {
      const db = await setup(
        {
          uid: 'user',
        },
        {
          'stores/ST01/menus/MU00': {
            id: 'test',
          },
        },
      );
      const ref = db.collection('stores').doc('ST01');

      expect(await assertSucceeds(ref.collection('menus').doc('MU00').get()));
    });
  });
});
