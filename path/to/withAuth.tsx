import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getTokenCookie, removeTokenCookie } from '../../utils/auth';
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

            const checkToken = async () => {
                try {
                    await axios.get('http://localhost:8000/api/check-token', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } catch (error) {
                    console.error('Token is invalid or expired:', error);
                    removeTokenCookie();
                    router.push('/login');
                }
            };

            checkToken();

            const intervalId = setInterval(checkToken, 600000);

            return () => clearInterval(intervalId);
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
