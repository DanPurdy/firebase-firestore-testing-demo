const { setup, teardown } = require('../helpers');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Staff update rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to update a staff member', async () => {
    const db = await setup(null, {
      'stores/ST00/staff/SM00': {
        name: 'staffmember',
      },
    });
    const ref = db.collection('stores').doc('ST00').collection('staff');

    expect(await assertFails(ref.doc('SM00').update({ name: 'newTest' })));
  });

  test('fail when a store admin tries to update another staff member from the same store', async () => {
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

    expect(await assertFails(ref.doc('SM00').update({ name: 'newTest' })));
  });

  test('fail when a store admin from a different store tries to update another staff member from the same store', async () => {
    const db = await setup(
      {
        uid: 'SM01',
        stores: ['ST01'],
      },
      {
        'stores/ST00/staff/SM00': {
          name: 'staffmember',
        },
      },
    );
    const ref = db.collection('stores').doc('ST00').collection('staff');

    expect(await assertFails(ref.doc('SM00').update({ name: 'newTest' })));
  });

  test('succeed when a user is a staff member and they try to update their own staff record', async () => {
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

    expect(await assertSucceeds(ref.doc('SM00').update({ name: 'newTest' })));
  });

  // Should never happen but lets check it succeeds to match our rules
  test('succeed when a user is not a staff member and they try to update their own staff record', async () => {
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

    expect(await assertSucceeds(ref.doc('SM00').update({ name: 'newTest' })));
  });
});
