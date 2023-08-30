const countries = require("./fixtures/countries.fixtures");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      const countryData = [
        {
          name: country?.name || "",
          phoneCode: country?.phoneCode || "",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      if (countryData.length > 0) {
        const countriesResponse = await queryInterface.bulkInsert(
          "countries",
          countryData,
          { returning: true }
        );

        if (country?.states?.length > 0) {
          for (let j = 0; j < country.states.length; j++) {
            const state = country.states[j];
            const stateData = [
              {
                name: state?.name || "",
                stateCode: state?.stateCode || "",
                isServiceAvailable: state?.isServiceAvailable || false,
                countryId: countriesResponse[0].id,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ];
            const statesResponse = await queryInterface.bulkInsert(
              "states",
              stateData,
              { returning: true }
            );

            if (state?.cities?.length > 0) {
              const citiesData = state.cities.map((city) => ({
                name: city,
                stateId: statesResponse[0].id,
                createdAt: new Date(),
                updatedAt: new Date()
              }));
              await queryInterface.bulkInsert("cities", citiesData);
            }
          }
        }
      }
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cities", null, {});
    await queryInterface.bulkDelete("states", null, {});
    await queryInterface.bulkDelete("countries", null, {});
  }
};
