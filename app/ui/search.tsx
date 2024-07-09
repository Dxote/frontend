'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
      <MagnifyingGlassIcon className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
    </div>
  );
}