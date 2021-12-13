import { createParamDecorator } from 'routing-controllers';

export function AccessToken(): any {
    return createParamDecorator({
        value: action => {
            return action.request.headers.authorization?.split(' ')[1];
        },
    });
}
