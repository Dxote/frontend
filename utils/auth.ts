import Cookies from 'js-cookie';

export const setTokenCookie = (token: string) => {
    const expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);
    Cookies.set('token', token, { expires: expirationTime });
};

export const getTokenCookie = (): string | undefined => {
    return Cookies.get('token');
};

export const removeTokenCookie = () => {
    Cookies.remove('token');
};