import { useEffect, useState } from 'react';
import axios from 'axios';
import { getTokenCookie } from '../utils/auth';
import Layout from '../components/layout';

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
                console.error('Error fetching profile data:', error);
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized: Your session has expired. Please login again.');
                } else {
                    setError('Error fetching profile data');
                }
            }
        };

        fetchProfile();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                {profile ? (
                    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <img src="/ryomen.gif" alt="Profile Picture" className="w-24 h-24 rounded-full" />
                                <div className="ml-4">
                                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                                    <p className="text-gray-600">{profile.email}</p>
                                </div>
                            </div>
                            <div className="text-gray-700">
                                <p className="mb-2"><span className="font-semibold">Bio:</span> {profile.bio}</p>
                                <p className="mb-2"><span className="font-semibold">Location:</span> {profile.location}</p>
                                <p><span className="font-semibold">Website:</span> <a href={profile.website} target="_blank" className="text-blue-500 hover:underline">{profile.website}</a></p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </Layout>
    );
};

export default Profile;