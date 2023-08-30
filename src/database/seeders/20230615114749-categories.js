const categoriesFixtures = require("./fixtures/categories.fixtures");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 0; i < categoriesFixtures.length; i++) {
      const categoriesData = categoriesFixtures[i];

      const categoryQueryResponse = await queryInterface.bulkInsert(
        "categories",
        [
          {
            categoryNameEN: categoriesData.categoryName,
            categoryNameES: `ES - ${categoriesData.categoryName}`,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { returning: true }
      );

      if (categoriesData?.products?.length > 0) {
        const productsQueryData = categoriesData?.products?.map(
          (product) => ({
            categoryId: categoryQueryResponse[0].id,
            productName: product.productName,
            productImage: product.productImage,
            description: product.description,
            mrp: product.mrp,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        );

        await queryInterface.bulkInsert("products", productsQueryData, {
          returning: true
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("products", null, {});
  }
};
