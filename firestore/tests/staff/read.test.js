const { setup, teardown } = require('../helpers');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Staff read rules', () => {
  describe('list', () => {
    afterAll(async () => {
      await teardown();
    });

    test('fail when a non authenticated user tries to load a list of staff members', async () => {
      const db = await setup();
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertFails(ref.get()));
    });

    test('fail when an authenticated user tries to load a list of staff members', async () => {
      const db = await setup({ uid: 'user' });
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertFails(ref.get()));
    });

    test('fail when an authenticated store admin from a different store tries to load a list of staff members', async () => {
      const db = await setup({ uid: 'user', stores: ['ST01'] });
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertFails(ref.get()));
    });

    test('succeed when an authenticated store admin from the same store tries to load a list of staff members', async () => {
      const db = await setup({ uid: 'user', stores: ['ST00'] });
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertSucceeds(ref.get()));
    });
  });

  describe('get', () => {
    afterAll(async () => {
      await teardown();
    });

    test('fail when a non authenticated user tries to load a staff member', async () => {
      const db = await setup(null, {
        'stores/ST00/staff/SM00': {
          name: 'staffmember',
        },
      });
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertFails(ref.doc('SM00').get()));
    });

    test('fail when a non store admin authenticated user tries to load a staff member', async () => {
      const db = await setup(
        {
          uid: 'user',
        },
        {
          'stores/ST00/staff/SM00': {
            name: 'staffmember',
          },
        },
      );
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertFails(ref.doc('SM00').get()));
    });

    test('fail when a store admin from a different store tries to load a staff member', async () => {
      const db = await setup(
        {
          uid: 'user',
          stores: ['ST01'],
        },
        {
          'stores/ST00/staff/SM00': {
            name: 'staffmember',
          },
        },
      );
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertFails(ref.doc('SM00').get()));
    });

    test('succeed when a store admin from the current store tries to load a different staff member', async () => {
      const db = await setup(
        {
          uid: 'SM01',
          stores: ['ST00'],
        },
        {
          'stores/ST00/staff/SM00': {
            name: 'staffmember',
          },
        },
      );
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertSucceeds(ref.doc('SM00').get()));
    });

    // This one should not really happen but if we remove a staff member and the record remains let's make sure it doesn't let them access it
    test('fail when a the user is not a staff member but they try to access their own staff record', async () => {
      const db = await setup(
        {
          uid: 'SM00',
        },
        {
          'stores/ST00/staff/SM00': {
            name: 'staffmember',
          },
        },
      );
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertFails(ref.doc('SM00').get()));
    });

    test('succeed when a the user is a staff member and they try to access their own staff record', async () => {
      const db = await setup(
        {
          uid: 'SM00',
          stores: ['ST00'],
        },
        {
          'stores/ST00/staff/SM00': {
            name: 'staffmember',
          },
        },
      );
      const ref = db.collection('stores').doc('ST00').collection('staff');

      expect(await assertSucceeds(ref.doc('SM00').get()));
    });
  });
});
