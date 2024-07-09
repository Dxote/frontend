import React from 'react';

interface Karyawan {
    id: number;
    name: string;
    address: string;
    phone: string;
}

interface TableProps {
    karyawan: Karyawan[];
    setSelectedKaryawan: (karyawan: Karyawan | null) => void;
    setEditModalOpen: (open: boolean) => void;
    setDeleteModalOpen: (open: boolean) => void;
}

const Table: React.FC<TableProps> = ({ karyawan, setSelectedKaryawan, setEditModalOpen, setDeleteModalOpen }) => {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {karyawan.map((k) => (
                    <tr key={k.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{k.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{k.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{k.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => {
                                    setSelectedKaryawan(k);
                                    setEditModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedKaryawan(k);
                                    setDeleteModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-900 ml-4"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;