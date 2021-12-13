import * as express from 'express';
import path from 'path';

import { WrongFileFormatError } from '../../api/errors/WrongFileFormatError';

export async function fileFilterForUserAvatars(
    req: Express.Request | express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
): Promise<void> {
    const ext = path.extname(file.originalname);
    const extensions = formatsForUserAvatar;
    if (!extensions.includes(ext)) {
        return cb(
            new WrongFileFormatError(
                400,
                'BadRequestError',
                'Invalid file format',
                [],
                file.fieldname,
                {
                    isInExtensions: 'Given file has incorrect format',
                }
            ),
            false
        );
    }
    cb(undefined, true);
}

export const formatsForUserAvatarImage = [
    '.jpg', '.JPG', '.jpeg', '.JPEG', '.jpe', '.JPE', '.jif', '.JIF', '.jfif', '.JFIF', '.jfi', '.JFI',
    '.png', '.PNG',
    '.gif', '.GIF',
    '.webp', '.WEBP',
    '.tiff', '.TIFF', '.tif', '.TIF',
    '.psd', '.PSD',
    '.raw', '.RAW', '.arw', '.ARW', '.cr2', '.CR2', '.nrw', '.NRW', '.k25', '.K25',
    '.bmp', '.BMP', '.dib', '.DIB',
    '.heif', '.HEIF', '.heic', '.HEIC',
    '.ind', '.IND', '.indd', '.INDD', '.indt', '.INDT',
    '.jp2', '.JP2', '.j2k', '.J2K', '.jpf', '.JPF', '.jpx', '.JPX', '.jpm', '.JPM', '.mj2', '.MJ2',
    '.svg', '.SVG', '.svgz', '.SVGZ',
];

export const formatsForUserAvatarVideo = [
    '.webm', '.WEBM',
    '.mkv', '.MKV',
    '.flv', '.FLV',
    '.avi', '.AVI',
    '.mp4', '.MP4', '.m4p', '.M4P', '.m4v', '.M4V',
    '.mpg', '.MPG', '.mp2', '.MP2', '.mpeg', '.MPEG', '.mpe', '.MPE', '.mpv', '.MPV',
    '.mov', '.MOV',
    '.3gp', '.3GP',
    '.flv', '.FLV', '.f4v', '.F4V',
];

const formatsForUserAvatar = [...formatsForUserAvatarImage, ...formatsForUserAvatarVideo];
