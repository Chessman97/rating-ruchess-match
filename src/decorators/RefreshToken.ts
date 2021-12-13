import { createParamDecorator } from 'routing-controllers';

export function RefreshToken(): any {
    return createParamDecorator({
        value: action => {
            return action.request.headers.authorization?.split(' ')[1];
        },
    });
}
