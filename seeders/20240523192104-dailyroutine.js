'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('dailyroutines', [
      { routineId: crypto.randomUUID(), name: "Rutina diaria de prueba número 1", description: "Esta es una rutina de prueba (1).", createdAt: new Date(), updatedAt: new Date() },
      { routineId: crypto.randomUUID(), name: "Rutina diaria de prueba número 2", description: "Esta es una rutina de prueba (2).", createdAt: new Date(), updatedAt: new Date() },
      { routineId: crypto.randomUUID(), name: "Rutina diaria de prueba número 3", description: "Esta es una rutina de prueba (3).", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dailyroutines', null, {});
  }
};
