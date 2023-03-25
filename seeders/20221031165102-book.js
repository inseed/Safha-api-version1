'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return queryInterface.bulkInsert('books', [{
      name: 'misery',
      userId: 1,
      pagesCount: 233,
      categoryId: 1,
      des: "this is my novel",
      cover: "this is empty",
      publish: "2022-10-30",
      lang: "Ar",
      publisherId: 1,
      ISBN: '123456778',
      categoryId: 1,
      author: 'Ghadir Alselwi',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
