import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import {
    getOsEnv, getOsEnvArray, getOsEnvOptional, getOsPath, getOsPaths, normalizePort, toBool,
    toNumber
} from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        apiKey: getOsEnv('APP_API_KEY'),
        corsWhitelist: getOsEnvArray('APP_CORS_WHITELIST'),
        dirs: {
            migrations: getOsPaths('TYPEORM_MIGRATIONS'),
            migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
            entities: getOsPaths('TYPEORM_ENTITIES'),
            entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
            controllers: getOsPaths('CONTROLLERS'),
            middlewares: getOsPaths('MIDDLEWARES'),
            interceptors: getOsPaths('INTERCEPTORS'),
            subscribers: getOsPaths('SUBSCRIBERS'),
            resolvers: getOsPaths('RESOLVERS'),
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    db: {
        type: getOsEnv('TYPEORM_CONNECTION'),
        host: getOsEnvOptional('TYPEORM_HOST'),
        port: toNumber(getOsEnvOptional('TYPEORM_PORT')),
        username: getOsEnvOptional('TYPEORM_USERNAME'),
        password: getOsEnvOptional('TYPEORM_PASSWORD'),
        database: getOsEnv('TYPEORM_DATABASE'),
        synchronize: toBool(getOsEnvOptional('TYPEORM_SYNCHRONIZE')),
        logging: getOsEnv('TYPEORM_LOGGING'),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        autogenerationEnabled: toBool(getOsEnv('SWAGGER_AUTOGENERATION_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
        fileEnabled: toBool(getOsEnv('SWAGGER_FILE_ENABLED')),
        filePath: getOsEnv('SWAGGER_FILE_PATH'),
        swaggerSchema: getOsEnv('SWAGGER_SCHEMA'),
        swaggerHost: getOsEnv('SWAGGER_HOST'),
        swaggerPort: getOsEnv('SWAGGER_PORT'),
        swaggerRoutePrefix: getOsEnv('SWAGGER_ROUTE_PREFIX'),
    },
    redis: {
        enabled: toBool(getOsEnv('REDIS_ENABLED')),
        host: getOsEnv('REDIS_HOST'),
        port: toNumber(getOsEnv('REDIS_PORT')),
    },
    graphql: {
        enabled: toBool(getOsEnv('GRAPHQL_ENABLED')),
        route: getOsEnv('GRAPHQL_ROUTE'),
        editor: toBool(getOsEnv('GRAPHQL_EDITOR')),
    },
    hasura: {
        enabled: toBool(getOsEnv('GRAPHQL_ENABLED')),
        remote: getOsEnv('HASURA_REMOTE'),
        secret: getOsEnv('HASURA_SECRET'),
        username: getOsEnv('HASURA_USERNAME'),
        password: getOsEnv('HASURA_PASSWORD'),

    },
    elasticsearch: {
        enabled: toBool(getOsEnv('ELASTICSEARCH_ENABLED')),
        host: getOsEnv('ELASTICSEARCH_HOST'),
        apiVersion: getOsEnv('ELASTICSEARCH_API_VERSION'),
        index: {
            mobile: getOsEnv('ELASTICSEARCH_INDEX_MOBILE_PREFIX'),
        },
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        username: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
};
