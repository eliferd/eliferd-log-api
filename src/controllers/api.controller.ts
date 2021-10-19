import { Request, Response } from 'express';
import { dbUtils } from '../config/database';
import { LogProviders } from '../models/elogproviders.model';
import { LogLevels } from '../models/eloglevels.model';
import { Logs } from '../models/elogs.model';
import * as jwt from 'jsonwebtoken';
import { sha512 } from 'js-sha512';
import { Auth } from '../models/eauth.model';
import { UserRoleEnum } from '../models/euserrole.model';

export class ApiController {
  public listLogLevels(req: Request, res: Response) {
    LogLevels.findAll<LogLevels>().then((logLvl: Array<LogLevels>) => res.json(logLvl))
      .catch((err: Error) => res.status(500).json({ err: err.message }));
  }

  public listLogProviders(req: Request, res: Response) {
    LogProviders.findAll<LogProviders>().then((logProviders: Array<LogProviders>) => res.json(logProviders))
      .catch((err: Error) => res.status(500).json({ err: err.message }));
  }

  public printLogs(req: Request, res: Response) {
    const { provider, level, message } = req.body;

    Promise.all([
      LogProviders.findOne<LogProviders>({
        where: { str_provider_name: provider ?? 'unknown-app' }
      }).then(foundProvider => foundProvider),

      LogLevels.findOne<LogLevels>({
        where: { str_name: level.toUpperCase() }
      }).then(matchLevel => matchLevel)
    ]).then(foundProviderAndLevel => {
      // eslint-disable-next-line camelcase
      const { id_log_provider } = foundProviderAndLevel[0] ?? { id_log_provider: 1 /* unknown-app */ };
      // eslint-disable-next-line camelcase
      const { id_log_level } = foundProviderAndLevel[1] ?? { id_log_level: 1 /* UNKNOWN */ };
      Logs.create({
        id_log_provider,
        id_log_level,
        str_message: message,
        print_date: dbUtils.now
      }).then(() => res.status(200).json({ succes: true }))
        .catch((err: Error) => res.status(500).json({ err: err.message }));
    }).catch((err: Error) => res.status(500).json({ err: err.message }));
  }

  public fetchAppLogs(req: Request, res: Response) {
    const { provider } = req.body;

    Promise.all([
      LogProviders.findOne<LogProviders>({
        where: { str_provider_name: provider ?? 'unknown-app' }
      }).then(foundProvider => foundProvider),

      LogLevels.findAll<LogLevels>().then(levels => levels)
    ]).then(logCriterias => {
      // eslint-disable-next-line camelcase
      const { str_provider_name, id_log_provider } = logCriterias[0];
      // eslint-disable-next-line camelcase
      const logLevels = logCriterias[1];
      Logs.findAll<Logs>({
        where: {
          id_log_provider
        }
      }).then((logs: Logs[]) => {
        // eslint-disable-next-line camelcase
        const mappedLogs = logs.map(({ id_log, id_log_provider, id_log_level, str_message, print_date }) =>
          ({ id_log, id_log_provider, id_log_level, str_message, str_provider_name, str_level: logLevels.find(lvl => lvl.id_log_level === id_log_level).str_name, print_date: Date.parse(print_date.toString()) }));
        res.status(200).json(mappedLogs);
      }).catch((err: Error) => res.status(500).json({ err: err.message }));
    }).catch((err: Error) => res.status(500).json({ err: err.message }));
  }

  public login(req: Request, res: Response) {
    // eslint-disable-next-line camelcase
    const { str_username, str_password } = req.body;
    Auth.findOne({
      where: {
        str_username,
        str_password: sha512(str_password)
      }
    }).then((foundUser: Auth) => {
      if (!foundUser) {
        res.json({
          message: 'Utilisateur introuvable. Action impossible.'
        });
      } else {
        switch (foundUser.id_user_role) {
          case UserRoleEnum.ADMIN:
            jwt.sign({
              id_user: foundUser.id_user,
              str_username: foundUser.str_username,
              id_user_role: foundUser.id_user_role
            }, process.env.LOGAPI_JWT_SECRET || 'logapi_secret_4795174', { noTimestamp: true }, (err, token) => {
              if (err) {
                res.json({ message: err })
              }
              res.json({ token });
            });
            break;
          case UserRoleEnum.APPLICATION:
            res.json({ message: 'Les identifiants destinés à être utilisés par l\'API ne sont pas autorisés à se connecter sur l\'interface web.' });
            break;
          default:
            res.json({ message: 'Rôle inconnu.' });
            break;
        }
      }
    }).catch((err: Error) => res.status(500).json({ err: err.message }));
  }
}
