import { HttpError } from 'routing-controllers';

export class WrongFileFormatError implements HttpError {
    public httpCode: number;
    public name: string;
    public message: string;
    public errors: any[];

    public constructor(code: number, name: string, message: string, children: any[], property: string, constraints: any) {
        this.httpCode = code;
        this.name = name;
        this.message = message;
        this.errors = [{
            children: [...children],
            property,
            constraints: Object.assign(constraints),
        }];
    }
}
