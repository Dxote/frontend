'use client';

import React from 'react';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import Button from '@/components/Button/Button';

export default function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  if (isNaN(currentPage) || isNaN(totalPages)) {
    return null;
  }

  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link href={`?page=${currentPage - 1}`}>
          <Button className={`text-gray-700 bg-gray-300 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-400 hover:text-white'}`}>
            Previous
          </Button>
        </Link>
        <Link href={`?page=${currentPage + 1}`}>
          <Button className={`text-gray-700 bg-gray-300 ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-400 hover:text-white'}`}>
            Next
          </Button>
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Link href={`?page=${currentPage - 1}`}>
              <Button className={`text-gray-700 bg-gray-300 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-400 hover:text-white'}`}>
                Previous
              </Button>
            </Link>
            {pages.map((page) => (
              <Link key={page} href={`?page=${page}`} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${page === currentPage ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
                {page}
              </Link>
            ))}
            <Link href={`?page=${currentPage + 1}`}>
              <Button className={`text-gray-700 bg-gray-300 ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-400 hover:text-white'}`}>
                Next
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}