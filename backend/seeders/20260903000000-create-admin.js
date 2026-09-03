'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME?.trim() || email;

    if (!email || !password) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD must be configured before seeding the admin user',
      );
    }

    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = :email LIMIT 1',
      { replacements: { email } },
    );

    if (users.length > 0) {
      await queryInterface.sequelize.query(
        'UPDATE Users SET role = :role, status = :status, is_verified = :isVerified, updatedAt = :updatedAt WHERE id = :id',
        {
          replacements: {
            id: users[0].id,
            role: 'admin',
            status: 'active',
            isVerified: true,
            updatedAt: new Date(),
          },
        },
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    await queryInterface.bulkInsert('Users', [
      {
        username,
        email,
        password: passwordHash,
        status: 'active',
        is_verified: true,
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (email) {
      await queryInterface.bulkDelete('Users', { email });
    }
  },
};
