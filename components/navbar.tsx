import { useRouter } from 'next/router';
import { getTokenCookie, removeTokenCookie } from '../utils/auth';
import axios from 'axios';

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = getTokenCookie();
      if (token) {
        await axios.get('http://localhost:8000/api/logout', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        removeTokenCookie();
      }
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      if (error.response && error.response.status === 401) {
        removeTokenCookie();
        router.push('/login');
      }
    }
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex justify-end items-center shadow-md">
      <button
        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2 transition duration-300"
        onClick={handleProfile}
      >
        Profile
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;