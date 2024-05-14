'use strict';
const bcrypt = require('bcrypt')
const crypto = require('crypto')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const AdminUUID = crypto.randomUUID();
    const BodyBuilderUUID = crypto.randomUUID();
    const TrainerUUID = crypto.randomUUID();

    await queryInterface.bulkInsert('userTypes', [
      { userTypeId: AdminUUID, description: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { userTypeId: BodyBuilderUUID, description: 'BodyBuilder', createdAt: new Date(), updatedAt: new Date() },
      { userTypeId: TrainerUUID, description: 'Trainer', createdAt: new Date(), updatedAt: new Date() },
    ]);

    await queryInterface.bulkInsert('users', [
      { userId: crypto.randomUUID(), email: 'emilianolezama@yahoo.com', password: await bcrypt.hash('qwerty', 10), username: 'Kir', name: 'Kirbith', middlename: 'Cubillas', lastname: 'Hernández', weight: 72.4, height: 184, dateOfBirth: '2003-04-05', userTypeId: AdminUUID, createdAt: new Date(), updatedAt: new Date() },
      { userId: crypto.randomUUID(), email: 'emilianolezama@outlook.com', password: await bcrypt.hash('qwerty', 10), username: 'Cesarele23', name: 'César', middlename: 'Lezama', lastname: 'López', weight: 72.4, height: 184, dateOfBirth: '2003-04-05', userTypeId: BodyBuilderUUID, createdAt: new Date(), updatedAt: new Date() },
      { userId: crypto.randomUUID(), email: 'emilianolezama@gmail.com', password: await bcrypt.hash('qwerty', 10), username: 'Jes', name: 'Jesus', middlename: 'Mujica', lastname: 'Conde', weight: 72.4, height: 180, dateOfBirth: '2003-04-05', userTypeId: TrainerUUID, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userTypes', null, {});
    await queryInterface.bulkDelete('users', null, {});

  }
};
