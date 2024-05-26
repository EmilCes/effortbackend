'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('muscles', [
      { muscleName: 'chest', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'obliques', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'abs', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'abductor', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'biceps', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'calves', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'forearm', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'shoulder', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'glutes', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'harmstrings', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'lats', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'lower_back', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'quads', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'trapezius', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'triceps', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'neck', createdAt: new Date(), updatedAt: new Date() },
      { muscleName: 'adductors', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('muscles', null, {});
  }
};
