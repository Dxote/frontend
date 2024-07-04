import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getTokenCookie, setTokenCookie, removeTokenCookie } from '../../utils/auth';
import axios from 'axios';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = getTokenCookie();
            if (!token) {
                router.push('/login');
                return;
            }

            const refreshToken = async () => {
                try {
                    const { data } = await axios.get('http://localhost:8000/api/refresh', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTokenCookie(data.token, 10);
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    removeTokenCookie();
                    router.push('/login');
                }
            };

            refreshToken();
            const intervalId = setInterval(refreshToken, 600000);

            return () => clearInterval(intervalId);
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;