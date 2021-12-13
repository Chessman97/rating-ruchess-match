import crypto from 'crypto';
import multer from 'multer';

import { env } from '../../env';

export function createMulterInstance(
    limits: {
        fieldNameSize?: number
        fieldSize?: number
        fields?: number
        fileSize?: number
        files?: number
        parts?: number
        headerPairs?: number
    },
    fileFilter: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void
    ) => void
): multer.Multer {
    return multer({
        limits,
        storage: multer.diskStorage({
            destination: (req: Express.Request, file: Express.Multer.File, cb: any): void => {
                cb(undefined, env.app.dirs.storageDir);
            },
            filename: (req: Express.Request, file: Express.Multer.File, cb: any) => {
                crypto.pseudoRandomBytes(16, (err, raw) => {
                    cb(err, err ? undefined : (raw.toString('hex') + file.originalname.substr(file.originalname.lastIndexOf('.'))) );
                });
            },
        }),
        fileFilter,
    });
}
