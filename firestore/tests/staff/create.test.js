const { setup, teardown } = require('../helpers');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Stores create rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to create a staff record', async () => {
    const db = await setup();

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').collection('staff').doc('SM01').set({ name: 'test' }),
      ),
    );
  });

  test('fail when a authenticated non store admin user tries to create their own staff record', async () => {
    const db = await setup({ uid: 'test' });

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').collection('staff').doc('test').set({ name: 'test' }),
      ),
    );
  });

  test('fail when a authenticated non store admin user tries to create a staff record with a random ID', async () => {
    const db = await setup({ uid: 'test' });

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').collection('staff').add({ name: 'test' }),
      ),
    );
  });

  test('fail when a authenticated store admin from a different store tries to create a staff record with a random ID', async () => {
    const db = await setup({ uid: 'test', stores: ['ST01'] });

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').collection('staff').add({ name: 'test' }),
      ),
    );
  });

  test('fail when a authenticated store admin from a different store tries to create a staff record with a specific ID', async () => {
    const db = await setup({ uid: 'test', stores: ['ST01'] });

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').collection('staff').doc('SM00').set({ name: 'test' }),
      ),
    );
  });

  test('succeed when a authenticated store admin from the same store tries to create a staff record with a specific ID', async () => {
    const db = await setup({ uid: 'test', stores: ['ST00'] });

    expect(
      await assertSucceeds(
        db.collection('stores').doc('ST00').collection('staff').doc('SM00').set({ name: 'test' }),
      ),
    );
  });

  test('succeed when a authenticated store admin from the same store tries to create a staff record with a random ID', async () => {
    const db = await setup({ uid: 'test', stores: ['ST00'] });

    expect(
      await assertSucceeds(
        db.collection('stores').doc('ST00').collection('staff').add({ name: 'test' }),
      ),
    );
  });
});
