import { useState } from 'react';
import { Transition } from 'react-transition-group';
import { HomeIcon, UserIcon, BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`flex flex-col h-full fixed left-0 top-0 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
        isHovered ? 'w-48' : 'w-16'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href="/dashboard">
        <div className="flex items-center py-4 pl-4 transition-all duration-300 transform hover:translate-x-4">
          <HomeIcon className="h-6 w-6" />
          {isHovered && <span className="ml-4">Dashboard</span>}
        </div>
      </Link>
      <Link href="/profile">
        <div className="flex items-center py-4 pl-4 transition-all duration-300 transform hover:translate-x-4">
          <UserIcon className="h-6 w-6" />
          {isHovered && <span className="ml-4">Profile</span>}
        </div>
      </Link>
      <Link href="/karyawan">
        <div className="flex items-center py-4 pl-4 transition-all duration-300 transform hover:translate-x-4">
          <BriefcaseIcon className="h-6 w-6" />
          {isHovered && <span className="ml-4">Karyawan</span>}
        </div>
      </Link>
      <Link href="/absensi">
        <div className="flex items-center py-4 pl-4 transition-all duration-300 transform hover:translate-x-4">
          <CalendarIcon className="h-6 w-6" />
          {isHovered && <span className="ml-4">Absensi</span>}
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;