import * as express from 'express';
import { Routes } from './config/routes';
import * as passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Auth } from './models/eauth.model';
import { UserRoleEnum } from './models/euserrole.model';
import { db } from './config/database';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';

dotenv.config();

class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();
    private jwtOPTS = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.LOGAPI_JWT_SECRET
    };

    constructor() {
      db.authenticate().then(() => console.log('SEQUELIZE - Authentication success.'))
        .catch(e => console.log('SEQUELIZE - Authentication failed\n', e))
      this.app = express();
      this.config();
      this.routePrv.routes(this.app);
    }

    private config() {
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(express.json());
      this.app.use(passport.initialize());
      this.app.use(helmet());
      this.app.use(cors({
        credentials: true,
        origin: true,
        methods: ['GET', 'POST', 'OPTIONS', 'HEAD']
      }));
      passport.use('jwt', new JwtStrategy(this.jwtOPTS, (jwtPayload: any, done: any) => {
        Auth.findOne({
          where: {
            id_user: jwtPayload.id_user
          }
        }).then((foundUser: Auth) => {
          if (!foundUser) {
            return done(new Error('Compte introuvable. Action impossible.'), false);
          } else {
            switch (foundUser.id_user_role) {
              case UserRoleEnum.ADMIN:
                return done(null, foundUser);

              case UserRoleEnum.APPLICATION:
                return done(new Error('Vous n\'êtes pas autorisé à utiliser les JWT.'), false);

              default:
                return done(new Error('Rôle inconnu.'), false);
            }
          }
        }).catch((err: Error) => done(err, false));
      }));

      passport.use(new LocalStrategy({
        usernameField: 'str_username',
        passwordField: 'str_password'
      }, (username: string, password: string, done: (err: Error, result: boolean | Auth) => void) => {
        Auth.findOne({
          where: {
            str_username: username,
            str_password: password
          }
        }).then((foundUser: Auth) => {
          if (!foundUser) {
            done(new Error('Utilisateur introuvable. Action impossible'), false);
          } else {
            switch (foundUser.id_user_role) {
              case UserRoleEnum.ADMIN:
              case UserRoleEnum.APPLICATION:
                return done(null, foundUser);
              default:
                return done(new Error('Rôle inconnu.'), false);
            }
          }
        }).catch((err: Error) => done(err, false));
      }));
    }
}
export default new App().app;
