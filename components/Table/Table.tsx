import React from 'react';

interface TableProps {
  headers: string[];
  data: { [key: string]: any }[];
  renderActions: (item: any) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, data, renderActions }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="py-2 px-4 border-b">{header}</th>
          ))}
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header} className="py-2 px-4 border-b">{item[header]}</td>
            ))}
            <td className="py-2 px-4 border-b space-x-2">
              {renderActions(item)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
