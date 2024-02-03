import { unlink } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    // await unlink(join(__dirname, '..', 'test.sqlite'));
    await unlink(join(__dirname, '..', process.env.DB_NAME));
  } catch (err) {
    console.log(err, 'error')
  }
});

global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
