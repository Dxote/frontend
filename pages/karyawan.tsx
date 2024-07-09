import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getTokenCookie } from '../utils/auth';
import Modal from '../components/Modal';
import Layout from '../components/layout';
import Button from '../components/Button';
import Table from '../components/Table';
import Pagination from '@/app/ui/invoices/pagination';
import queryString from 'query-string';

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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const router = useRouter();

    useEffect(() => {
        const query = router.query.page;
        const page = query ? parseInt(query as string, 10) : 1;
        setCurrentPage(page);
    }, [router.query.page]);

    useEffect(() => {
        fetchKaryawan(currentPage);
    }, [currentPage]);

    const fetchKaryawan = async (page: number) => {
        try {
            const token = getTokenCookie();
            if (!token) {
                router.push('/login');
                return;
            }
            const response = await axios.get(`http://localhost:8000/api/karyawan?${queryString.stringify({ page })}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            console.log('API Response:', data);
            if (data && Array.isArray(data.data)) {
                setKaryawan(data.data);
                setTotalPages(data.last_page || 1);
            } else {
                setError('Error fetching karyawan data');
            }
        } catch (error) {
            console.error('Error fetching karyawan data:', error);
            setError('Error fetching karyawan data');
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`/karyawan?page=${newPage}`, undefined, { shallow: true });
    };

    const handleAdd = () => {
        setAddModalOpen(true);
    };

    const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const token = getTokenCookie();
            if (!token) {
                router.push('/login');
                return;
            }
            const { data } = await axios.post('http://localhost:8000/api/karyawan', addFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKaryawan([...karyawan, data]);
            setAddModalOpen(false);
            setAddFormData({ name: '', address: '', phone: '' });
        } catch (error) {
            console.error('Error adding karyawan:', error);
            setError('Error adding karyawan');
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddFormData({
            ...addFormData,
            [event.target.name]: event.target.value,
        });
    };

    const handleEditModalOpen = (karyawan: Karyawan) => {
        setEditFormData(karyawan);
        setEditModalOpen(true);
    };

    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const token = getTokenCookie();
            if (!token) {
                router.push('/login');
                return;
            }
            const { data } = await axios.put(`http://localhost:8000/api/karyawan/${editFormData.id}`, editFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedKaryawan = karyawan.map((k) => (k.id === editFormData.id ? data : k));
            setKaryawan(updatedKaryawan);
            setEditModalOpen(false);
        } catch (error) {
            console.error('Error editing karyawan:', error);
            setError('Error editing karyawan');
        }
    };

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({
            ...editFormData,
            [event.target.name]: event.target.value,
        });
    };

    const handleDeleteModalOpen = (karyawan: Karyawan) => {
        setSelectedKaryawan(karyawan);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedKaryawan) return;
        try {
            const token = getTokenCookie();
            if (!token) {
                router.push('/login');
                return;
            }
            await axios.delete(`http://localhost:8000/api/karyawan/${selectedKaryawan.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKaryawan(karyawan.filter((k) => k.id !== selectedKaryawan.id));
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting karyawan:', error);
            setError('Error deleting karyawan');
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
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
                            className="block w-full mb-2"
                        />
                        <input
                            type="text"
                            name="address"
                            value={addFormData.address}
                            onChange={handleInputChange}
                            placeholder="Address"
                            className="block w-full mb-2"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={addFormData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone"
                            className="block w-full mb-2"
                        />
                        <Button type="submit" className="bg-blue-500 text-white">Add</Button>
                    </form>
                </Modal>
                <Modal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    title="Edit Karyawan"
                >
                    <form onSubmit={handleEdit}>
                        <input
                            type="hidden"
                            name="id"
                            value={editFormData.id}
                        />
                        <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditInputChange}
                            placeholder="Name"
                            className="block w-full mb-2"
                        />
                        <input
                            type="text"
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditInputChange}
                            placeholder="Address"
                            className="block w-full mb-2"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditInputChange}
                            placeholder="Phone"
                            className="block w-full mb-2"
                        />
                        <Button type="submit" className="bg-blue-500 text-white">Update</Button>
                    </form>
                </Modal>
                <Modal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    title="Delete Karyawan"
                >
                    <p>Are you sure you want to delete this karyawan?</p>
                    <Button onClick={handleDelete} className="bg-red-500 text-white">Delete</Button>
                </Modal>
            </div>
        </Layout>
    );
};

export default Karyawan;