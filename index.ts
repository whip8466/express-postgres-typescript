require("dotenv").config();
import server from './src/server';
import { sequelize } from "./src/database/database";

const PORT = process.env.PORT || 3300;
server.listen(PORT, () => {
  console.log(`Server is live at localhost:${PORT}`);

  sequelize
    .authenticate()
    .then(async () => {
      console.log(`database is connected : ${process.env.DATABASE_NAME}`);
      try {
        if(process.env.NODE_ENV === 'local') {
          // await sequelize.sync({ force: true });
          // console.log(`${process.env.DATABASE_NAME} : All the tables was just (re)created!`);

          await sequelize.sync({ alter: true });
          console.log(`${process.env.DATABASE_NAME} : All models were synchronized successfully.`);
        } else {
          await sequelize.sync({ alter: true });
          console.log(`${process.env.DATABASE_NAME} : All models were synchronized successfully.`);
        }
      } catch (error) {
        throw error;
      }
    })
    .catch((error: any) => {
      console.log('database error: ', error.message);
    });
});
