import { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenCookie } from '../utils/auth';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getTokenCookie();
                if (!token) {
                    setError('No token found');
                    return;
                }
                const { data } = await axios.get('http://localhost:8000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(data.user);
            } catch (error) {
                setError('Error fetching profile data');
            }
        };

        fetchProfile();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            {profile ? (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <p className="text-gray-700">{profile.name}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <p className="text-gray-700">{profile.email}</p>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;