import * as express from 'express';
import { ApiController } from '../controllers/api.controller';
import * as passport from 'passport';

export class Routes {
    public apiController = new ApiController();
    private jwtGate = passport.authenticate('jwt', { session: false });
    private authGate = passport.authenticate('local', { session: false });

    public routes(app: express.Application): void {
      /**
       * Routes dédiés à l'interface Web
       */
      app.route('/api/levels').get(this.jwtGate, this.apiController.listLogLevels);
      app.route('/api/providers').get(this.jwtGate, this.apiController.listLogProviders);
      app.route('/api/logs').get(this.jwtGate, this.apiController.fetchAppLogs);
      app.route('/api/login').post(this.apiController.login);

      /**
       * Routes dédiés aux applications consommatrices de l'API
       */
      app.route('/api/print').post(this.authGate, this.apiController.printLogs);
    }
}
