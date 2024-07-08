import React from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <main className="p-4 ml-16 transition-all duration-300 ease-in-out">{children}</main>
      </div>
    </div>
  );
};

export default Layout;