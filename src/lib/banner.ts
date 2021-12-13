import { env } from '../env';
import { Logger } from '../lib/logger';

export function banner(log: Logger): void {
    if (env.app.banner) {
        const route = () => `${env.app.schema}://${env.app.host}:${env.app.port}`;
        log.info(`Aloha, your app is ready on ${route()}${env.app.routePrefix}`);
        log.info(`To shut it down, press <CTRL> + C at any time.`);
        log.info('-------------------------------------------------------');
        log.info(`Environment  : ${env.node}`);
        log.info(`Version      : ${env.app.version}\n`);
        log.info(`API Info     : ${route()}${env.app.routePrefix}`);
        if (env.swagger.enabled) {
            log.info(`Swagger      : ${route()}${env.swagger.route}`);
        }
        if (env.graphql.enabled) {
            log.info(`GraphQL      : ${route()}${env.graphql.route}`);
        }
        log.info(`Prometheus   : ${route()}/metrics` );
        log.info('-------------------------------------------------------');
    } else {
        log.info(`Application is up and running.`);
    }
}
