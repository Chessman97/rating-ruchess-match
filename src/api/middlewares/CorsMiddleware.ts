import cors from 'cors';
import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { env } from '../../env';

@Middleware({ type: 'before' })
export class CorsMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const whitelist = env.app.corsWhitelist;
        const corsOptions = {
            credentials: true,
            origin: (origin: any, callback: any): any  => {
                if (whitelist.indexOf(origin) !== -1 || !origin) {
                    // tslint:disable-next-line:no-null-keyword
                    callback(null, origin);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
        };
        cors(corsOptions)(req, res, next);
    }

}
