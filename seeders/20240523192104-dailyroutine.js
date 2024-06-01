'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('dailyroutines', [
      { name: "Rutina diaria de prueba número 1", createdAt: new Date(), updatedAt: new Date() },
      { name: "Rutina diaria de prueba número 2", createdAt: new Date(), updatedAt: new Date() },
      { name: "Rutina diaria de prueba número 3", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dailyroutines', null, {});
  }
};
