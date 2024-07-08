import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getTokenCookie } from '../utils/auth';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';

interface Absensi {
  id: string;
  email: string;
  login_time: string;
}

const Absensi: React.FC = () => {
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [selectedAbsensi, setSelectedAbsensi] = useState<Absensi | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const fetchAbsensi = async () => {
    try {
      const token = getTokenCookie();
      if (!token) {
        router.push('/login');
        return;
      }
      const { data } = await axios.get<Absensi[]>('http://localhost:8000/api/absensi', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAbsensi(data);
    } catch (error) {
      setError('Error fetching absensi data');
      console.error('Error fetching absensi:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = getTokenCookie();
      if (selectedAbsensi && token) {
        const url = `http://localhost:8000/api/absensi/${selectedAbsensi.id}`;
        console.log('Deleting URL:', url);
        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAbsensi(absensi.filter(a => a.id !== selectedAbsensi.id));
        setDeleteModalOpen(false);
      }
    } catch (error) {
      setError('Error deleting absensi data');
      console.error('Error deleting absensi:', error);
    }
  };

  const handleDeleteModalOpen = (absensi: Absensi) => {
    setSelectedAbsensi(absensi);
    setDeleteModalOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">List Absensi</h1>
        {error && <p className="text-red-500">{error}</p>}
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Jam Login</th>
              <th className="py-2 px-4 text-left">Tanggal</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {absensi.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="py-2 px-4">{entry.email}</td>
                <td className="py-2 px-4">{new Date(entry.login_time).toLocaleTimeString()}</td>
                <td className="py-2 px-4">{new Date(entry.login_time).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <Button onClick={() => handleDeleteModalOpen(entry)} className="bg-red-500 text-white">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Absensi"
        >
          <p>Are you sure you want to delete this absensi entry?</p>
          <div className="flex justify-end">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2"
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Absensi;