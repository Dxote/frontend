import React from 'react';

interface TableProps {
    headers: string[];
    data: any[];
    renderActions?: (item: any) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, data = [], renderActions }) => {
    if (!Array.isArray(data)) return null;

    return (
        <table className="min-w-full leading-normal">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                    {renderActions && <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        {headers.map((header, idx) => (
                            <td key={idx} className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {item[header]}
                            </td>
                        ))}
                        {renderActions && (
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {renderActions(item)}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;