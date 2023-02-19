import express, { Router } from 'express';
import authRoute from './auth.route';

const routerVersion1 = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const routes: IRoute[] = [
  {
    path: "/auth",
    route: authRoute,
  },
];

routes.forEach((route: IRoute) => {
  routerVersion1.use(route.path, route.route);
});

export default routerVersion1;
