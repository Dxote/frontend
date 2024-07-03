import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            } else {
                setLoading(false);
            }
        }, [router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        return <Component {...props} />;
    };
}
