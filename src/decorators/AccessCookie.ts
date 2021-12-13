import { createParamDecorator } from 'routing-controllers';

export function AccessCookie(): any {
    return createParamDecorator({
        value: action => {
            return action.request.cookies?._auth;
        },
    });
}
