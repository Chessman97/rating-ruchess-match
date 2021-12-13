import * as express from 'express';
import basicAuth from 'express-basic-auth';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import client from 'prom-client';

import { env } from '../env';

export const promLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const expressApp = settings.getData('express_app') as express.Application;
        const register = new client.Registry();
        register.setDefaultLabels({
            app: 'node-backend',
        });
        client.collectDefaultMetrics({ register });
        expressApp.get(
            '/metrics',
            env.monitor.username ? basicAuth({
                users: {
                    [`${env.monitor.username}`]: env.monitor.password,
                },
                challenge: true,
            }) : (req, res, next) => next(),
            (req: express.Request, res: express.Response) => {
                res.setHeader('Content-Type', register.contentType);
                register.metrics().then((value) => {
                    res.end(value);
                });
            }
        );
    }
};
