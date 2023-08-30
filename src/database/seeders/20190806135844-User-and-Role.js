// const bcrypt = require("bcrypt");
const { ROLES } = require("../config/roles");
// const { GENDER, LANGUAGES } = require("../config/enums");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = await queryInterface.bulkInsert(
      "roles",
      [
        {
          roleName: ROLES.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          roleName: ROLES.CUSTOMER,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: true }
    );

    // const users = await queryInterface.bulkInsert(
    //   "users",
    //   [
    //     {
    //       firstName: "Admin",
    //       lastName: "",
    //       email: "admin@viapromeds.com",
    //       phone: "",
    //       gender: GENDER.MALE,
    //       password: await bcrypt.hash("admin", 8),
    //       lang: LANGUAGES.EN,
    //       createdAt: new Date(),
    //       updatedAt: new Date()
    //     }
    //   ],
    //   { returning: true, validate: true, individualHooks: true }
    // );

    // const rolesRows = roles[0];
    // const usersRows = users[0];

    // await queryInterface.bulkInsert(
    //   "userRoles",
    //   [
    //     {
    //       userId: usersRows.id,
    //       roleId: rolesRows.id,
    //       createdAt: new Date(),
    //       updatedAt: new Date()
    //     }
    //   ],
    //   {}
    // );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("userRoles", null, {});
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("users", null, {});
  }
};
