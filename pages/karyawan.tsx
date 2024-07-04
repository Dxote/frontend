import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getTokenCookie } from '../utils/auth';
import Modal from '../components/Modal';
import Layout from '../components/layout';
import withAuth from '../path/to/withAuth';
import Button from '../components/Button';
import Table from '../components/Table'

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

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        if (editModalOpen) {
            setEditFormData({
                ...editFormData,
                [name]: value
            });
        } else {
            setAddFormData({
                ...addFormData,
                [name]: value
            });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Daftar Karyawan</h1>
                    <Button onClick={handleAdd} className="bg-blue-500 text-white">Add Karyawan</Button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Table
                    headers={['name', 'address', 'phone']}
                    data={karyawan}
                    renderActions={(item) => (
                        <>
                            <Button onClick={() => handleEditModalOpen(item)} className="bg-yellow-500 text-white">Edit</Button>
                            <Button onClick={() => handleDeleteModalOpen(item)} className="bg-red-500 text-white">Delete</Button>
                        </>
                    )}
                />
            </div>
            <Modal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                title="Add Karyawan"
            >
                <form onSubmit={handleAddSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={addFormData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        name="address"
                        value={addFormData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={addFormData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                    />
                    <Button
                        type="submit"
                        className="bg-blue-500 text-white"
                    >
                        Submit
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Karyawan"
            >
                <form onSubmit={handleEdit}>
                    <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        name="address"
                        value={editFormData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                    />
                    <Button
                        type="submit"
                        className="bg-blue-500 text-white"
                    >
                        Submit
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Karyawan"
            >
                <p>Are you sure you want to delete {selectedKaryawan?.name}?</p>
                <Button
                    onClick={handleDelete}
                    className="bg-red-500 text-white"
                >
                    Delete
                </Button>
            </Modal>
        </Layout>
    );
};

export default withAuth(Karyawan);
