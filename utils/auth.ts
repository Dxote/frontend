import Cookies from 'js-cookie';

export const setTokenCookie = (token: string, expiresInSeconds: number = 600) => {
    Cookies.set('token', token, { expires: expiresInSeconds / 86400 });
};

export const getTokenCookie = (): string | undefined => {
    return Cookies.get('token');
};

export const removeTokenCookie = () => {
    Cookies.remove('token');
};