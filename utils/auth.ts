import Cookies from 'js-cookie';

export const setTokenCookie = (token: string) => {
  Cookies.set('token', token, { expires: 7 });
};

export const getTokenCookie = () => {
    return Cookies.get('token');
};

export const removeTokenCookie = () => {
  Cookies.remove('token');
};