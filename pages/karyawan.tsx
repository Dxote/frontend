import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getTokenCookie, removeTokenCookie } from '../utils/auth';
import CustomModal from '../components/Modal';
import withAuth from '../path/to/withAuth';

interface Karyawan {
    id: string;
    name: string;
    address: string;
    phone: string;
}

const Karyawan: React.FC = () => {
    const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
    const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [addFormData, setAddFormData] = useState({
        name: '',
        address: '',
        phone: ''
    });
    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        address: '',
        phone: ''
    });
    const router = useRouter();

    useEffect(() => {
        fetchKaryawan();
    }, []);

    const fetchKaryawan = async () => {
        try {
            const token = getTokenCookie();
            if (!token) {
                router.push('/login');
                return;
            }
            const { data } = await axios.get<Karyawan[]>('http://localhost:8000/api/karyawan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKaryawan(data);
        } catch (error) {
            setError('Error fetching karyawan data');
        }
    };

    const handleDelete = async () => {
        try {
            const token = getTokenCookie();
            if (selectedKaryawan && token) {
                await axios.delete(`http://localhost:8000/api/karyawandelete/${selectedKaryawan.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setKaryawan(karyawan.filter(k => k.id !== selectedKaryawan.id));
                setDeleteModalOpen(false);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('Error deleting karyawan data');
            }
        }
    };

    const handleEdit = async () => {
        try {
            const token = getTokenCookie();
            await axios.put(`http://localhost:8000/api/karyawanupdate/${editFormData.id}`, editFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedKaryawan = karyawan.map(k => k.id === editFormData.id ? editFormData : k);
            setKaryawan(updatedKaryawan);
            setEditModalOpen(false);
        } catch (error) {
            setError('Error editing karyawan data');
        }
    };

    const handleAddSubmit = async () => {
        try {
            const token = getTokenCookie();
            await axios.post('http://localhost:8000/api/karyawancreate', addFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchKaryawan();
            setAddModalOpen(false);
            setAddFormData({
                name: '',
                address: '',
                phone: ''
            });
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('Error adding karyawan data');
            }
        }
    };

    const handleEditModalOpen = (karyawan: Karyawan) => {
        setSelectedKaryawan(karyawan);
        setEditFormData({
            id: karyawan.id,
            name: karyawan.name,
            address: karyawan.address,
            phone: karyawan.phone
        });
        setEditModalOpen(true);
    };

    const handleDeleteModalOpen = (karyawan: Karyawan) => {
        setSelectedKaryawan(karyawan);
        setDeleteModalOpen(true);
    };

    const handleAdd = () => {
        setAddModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddFormData({
            ...addFormData,
            [name]: value
        });
    };

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
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access during logout');
            } else {
                console.error('Error during logout', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-4">
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded"
                    onClick={handleAdd}
                >
                    Add Karyawan
                </button>
                <button
                    className="bg-red-500 text-white py-2 px-4 rounded"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-4">List of Karyawan</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Address</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {karyawan.map((karyawan) => (
                            <tr key={karyawan.id}>
                                <td className="py-2 px-4 border-b">{karyawan.name}</td>
                                <td className="py-2 px-4 border-b">{karyawan.address}</td>
                                <td className="py-2 px-4 border-b">{karyawan.phone}</td>
                                <td className="py-2 px-4 border-b space-x-2">
                                    <button
                                        className="text-blue-500"
                                        onClick={() => handleEditModalOpen(karyawan)}
                                    >
                                        Edit
                                        </button>
                                <button
                                    className="text-red-500"
                                    onClick={() => handleDeleteModalOpen(karyawan)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <CustomModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSubmit={handleAddSubmit}
            title="Add Karyawan"
        >
            <input
                type="text"
                placeholder="Name"
                name="name"
                value={addFormData.name}
                onChange={handleInputChange}
                className="mb-2 border border-gray-300 p-2 rounded w-full"
            />
            <input
                type="text"
                placeholder="Address"
                name="address"
                value={addFormData.address}
                onChange={handleInputChange}
                className="mb-2 border border-gray-300 p-2 rounded w-full"
            />
            <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={addFormData.phone}
                onChange={handleInputChange}
                className="mb-2 border border-gray-300 p-2 rounded w-full"
            />
        </CustomModal>

        <CustomModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEdit}
            title="Edit Karyawan"
        >
            <input
                type="text"
                placeholder="Name"
                name="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="mb-2 border border-gray-300 p-2 rounded w-full"
            />
            <input
                type="text"
                placeholder="Address"
                name="address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="mb-2 border border-gray-300 p-2 rounded w-full"
            />
            <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="mb-2 border border-gray-300 p-2 rounded w-full"
            />
        </CustomModal>

        <CustomModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onSubmit={handleDelete}
            title="Delete Karyawan"
        >
            <p>Are you sure you want to delete {selectedKaryawan?.name}?</p>
        </CustomModal>
    </div>
);
};
export default withAuth(Karyawan);