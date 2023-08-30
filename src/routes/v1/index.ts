import express from 'express';
const router = express.Router();

import authRoute from './auth.route';
import categoryRoute from './category.route';
import userRoute from './user.route';
import productsRoute from './products.route';
import geolocationRoute from './geolocation.route';

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/products',
    route: productsRoute,
  },
  {
    path: '/geolocation',
    route: geolocationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
