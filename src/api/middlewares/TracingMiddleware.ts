import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import * as uuid from 'uuid';

@Middleware({ type: 'before', priority: 1 })
export class TraceIdMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const clsNamespace = (global as any).frameworkSettings.getData('clsNamespace');
        clsNamespace.bindEmitter(req);
        clsNamespace.bindEmitter(res);
        const traceID = uuid.v4();
        clsNamespace.run(() => {
            clsNamespace.set('traceID', traceID);
            /* line for setting forwarded header value inside cls.
             * used by corresponding method getForwarded() in logger.ts
             */
            clsNamespace.set('forwarded', req.headers['x-forwarded-for'] || '');
            next();
        });
    }

}
