/* eslint-disable no-shadow */
/* eslint-disable no-prototype-builtins */
import { defaultMetadataStorage } from 'class-transformer/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import basicAuth from 'express-basic-auth';
import * as fs from 'fs';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

import { env } from '../env';

export const swaggerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.swagger.enabled) {
        const expressApp = settings.getData('express_app');

        let swaggerFile: any;

        if (env.swagger.autogenerationEnabled) {
            const schemas = validationMetadatasToSchemas({
                classTransformerMetadataStorage: defaultMetadataStorage,
                refPointerPrefix: '#/components/schemas/',
            });

            swaggerFile = routingControllersToSpec(
                getMetadataArgsStorage(),
                { },
                {
                    components: {
                        schemas,
                        securitySchemes: {
                            ApiKeyAuth: {
                                type: 'apiKey',
                                in: 'header',
                                name: 'Access',
                            },
                        },
                    },
                }
            );
        } else {
            swaggerFile = YAML.load(path.join(__dirname, '..', env.swagger.filePath));
        }

        // Add npm infos to the swagger doc
        swaggerFile.info = {
            title: env.app.name,
            description: env.app.description,
            version: env.app.version,
        };

        swaggerFile.info.description += addChangelogInfo();
        swaggerFile.info.description += addAPIReadmeInfo();

        swaggerFile.servers = [
            {
                url: `${env.swagger.swaggerSchema}://` +
                    `${env.swagger.swaggerHost}${env.swagger.swaggerPort ? `:${env.swagger.swaggerPort}` : ''}${env.swagger.swaggerRoutePrefix}`,
            },
            {
                url: `${env.app.schema}://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
            },
        ];

        swaggerFile = editRequestBodyContentMultipart(swaggerFile);
        swaggerFile = editRequestBodyCustomSchemas(swaggerFile);

        if (env.swagger.fileEnabled) {
            fs.writeFileSync(env.swagger.filePath, JSON.stringify(swaggerFile, undefined, 2));
        }

        // remove from swagger routes with specified tag:
        // eslint-disable-next-line guard-for-in
        for (const route in swaggerFile.paths) {
            for (const method in swaggerFile.paths[route]) {
                if (swaggerFile.paths[route][method].tags && (swaggerFile.paths[route][method].tags as string[]).includes('IgnoreInSwagger')) {
                    swaggerFile.paths[route][method] = undefined;
                }
            }
        }

        expressApp.use(
            env.swagger.route,
            env.swagger.username ? basicAuth({
                users: {
                    [`${env.swagger.username}`]: env.swagger.password,
                },
                challenge: true,
            }) : (req, res, next) => next(),
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );

    }

    function editRequestBodyContentMultipart(swaggerFile: any): any {
        for (const path in swaggerFile.paths as any) {
            if (
                swaggerFile.paths[path].hasOwnProperty('post') &&
                swaggerFile.paths[path].post.hasOwnProperty('requestBody') &&
                swaggerFile.paths[path].post.requestBody.hasOwnProperty('content') &&
                swaggerFile.paths[path].post.requestBody.content.hasOwnProperty('application/json') &&
                swaggerFile.paths[path].post.requestBody.content.hasOwnProperty('multipart/form-data')
            ) {
                delete swaggerFile.paths[path].post.requestBody.content['application/json'];
            } else if (
                swaggerFile.paths[path].hasOwnProperty('put') &&
                swaggerFile.paths[path].put.hasOwnProperty('requestBody') &&
                swaggerFile.paths[path].put.requestBody.hasOwnProperty('content') &&
                swaggerFile.paths[path].put.requestBody.content.hasOwnProperty('application/json') &&
                swaggerFile.paths[path].put.requestBody.content.hasOwnProperty('multipart/form-data')
            ) {
                delete swaggerFile.paths[path].put.requestBody.content['application/json'];
            }
        }
        return swaggerFile;
    }

    function editRequestBodyCustomSchemas(swaggerFile: any): any {
        for (const path in swaggerFile.paths as any) {
            if (
                swaggerFile.paths[path].hasOwnProperty('post') &&
                swaggerFile.paths[path].post.hasOwnProperty('requestBody') &&
                swaggerFile.paths[path].post.requestBody.hasOwnProperty('content') &&
                swaggerFile.paths[path].post.requestBody.content.hasOwnProperty('application/json') &&
                swaggerFile.paths[path].post.requestBody.content['application/json'].hasOwnProperty('schema') &&
                swaggerFile.paths[path].post.requestBody.content['application/json'].schema.hasOwnProperty('type')
            ) {
                delete swaggerFile.paths[path].post.requestBody.content['application/json'].schema.$ref;
            } else if (
                swaggerFile.paths[path].hasOwnProperty('put') &&
                swaggerFile.paths[path].put.hasOwnProperty('requestBody') &&
                swaggerFile.paths[path].put.requestBody.hasOwnProperty('content') &&
                swaggerFile.paths[path].put.requestBody.content.hasOwnProperty('application/json') &&
                swaggerFile.paths[path].put.requestBody.content['application/json'].hasOwnProperty('schema') &&
                swaggerFile.paths[path].put.requestBody.content['application/json'].schema.hasOwnProperty('type')
            ) {
                delete swaggerFile.paths[path].put.requestBody.content['application/json'].schema.$ref;
            }
        }
        return swaggerFile;
    }

    function addChangelogInfo(): string {
        const changelogData = `<br><br>` +
            `<details>` +
            `<summary><b><big>Changelog</big></b></summary>` +
            `${fs.readFileSync(path.join(process.cwd(), 'CHANGELOG.MD'), 'utf8')}` +
            `</details>`;
        return changelogData;
    }

    function addAPIReadmeInfo(): string {
        const changelogData = `<br><br>` +
            `<details>` +
            `<summary><b><big>ReadMe</big></b></summary>` +
            `${fs.readFileSync(path.join(process.cwd(), 'APIReadMe.MD'), 'utf8')}` +
            `</details>`;
        return changelogData;
    }

};
