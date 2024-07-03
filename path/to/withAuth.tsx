import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getTokenCookie } from '../../utils/auth';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = getTokenCookie();
            if (!token) {
                router.push('/login');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
