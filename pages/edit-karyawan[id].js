import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../middleware/auth';

function EditKaryawan() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchKaryawan = async () => {
            const token = localStorage.getItem('token');
            try {
                const { data } = await axios.get(`http://localhost:8000/api/karyawan/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setName(data.name);
                setAddress(data.address);
                setPhone(data.phone);
            } catch (error) {
                setError('Error fetching karyawan data');
            }
        };

        if (id) {
            fetchKaryawan();
        }
    }, [id]);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:8000/api/karyawan/${id}`, {
                name,
                address,
                phone,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            router.push('/karyawan');
        } catch (error) {
            setError('Error updating karyawan data');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Karyawan</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700">Address</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700">Phone</label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Update
            </button>
        </div>
    );
}

export default withAuth(EditKaryawan);