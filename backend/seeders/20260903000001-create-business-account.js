'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const email = process.env.BUSINESS_EMAIL?.trim().toLowerCase();
    const password = process.env.BUSINESS_PASSWORD;
    const username = process.env.BUSINESS_USERNAME?.trim() || email;
    const businessName = process.env.BUSINESS_NAME?.trim() || 'SnapMart Business';

    if (!email || !password) {
      throw new Error(
        'BUSINESS_EMAIL and BUSINESS_PASSWORD must be configured before seeding the business account',
      );
    }

    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = :email LIMIT 1',
      { replacements: { email } },
    );

    let userId;
    const passwordHash = await bcrypt.hash(password, 12);

    if (users.length > 0) {
      userId = users[0].id;
      await queryInterface.sequelize.query(
        'UPDATE Users SET username = :username, password = :password, role = :role, status = :status, is_verified = :isVerified, updatedAt = :updatedAt WHERE id = :id',
        {
          replacements: {
            id: userId,
            username,
            password: passwordHash,
            role: 'business',
            status: 'active',
            isVerified: true,
            updatedAt: new Date(),
          },
        },
      );
    } else {
      const now = new Date();
      await queryInterface.bulkInsert('Users', [
        {
          username,
          email,
          password: passwordHash,
          status: 'active',
          is_verified: true,
          role: 'business',
          createdAt: now,
          updatedAt: now,
        },
      ]);

      const [createdUsers] = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE email = :email LIMIT 1',
        { replacements: { email } },
      );
      userId = createdUsers[0].id;
    }

    const [businesses] = await queryInterface.sequelize.query(
      'SELECT id FROM Businesses WHERE userId = :userId LIMIT 1',
      { replacements: { userId } },
    );

    if (businesses.length > 0) {
      await queryInterface.sequelize.query(
        'UPDATE Businesses SET businessName = :businessName, email = :email, status = :status, updatedAt = :updatedAt WHERE id = :id',
        {
          replacements: {
            id: businesses[0].id,
            businessName,
            email,
            status: 'approved',
            updatedAt: new Date(),
          },
        },
      );
      return;
    }

    const now = new Date();
    await queryInterface.bulkInsert('Businesses', [
      {
        userId,
        businessName,
        email,
        status: 'approved',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    const email = process.env.BUSINESS_EMAIL?.trim().toLowerCase();

    if (!email) return;

    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = :email LIMIT 1',
      { replacements: { email } },
    );

    if (users.length > 0) {
      await queryInterface.bulkDelete('Businesses', { userId: users[0].id });
      await queryInterface.bulkDelete('Users', { id: users[0].id });
    }
  },
};
