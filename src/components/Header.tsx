import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import type { UserResource } from '@clerk/types';

interface HeaderProps {
  user: UserResource | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Internal AI Assistant</h1>
          </div>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {/* Optionally show user avatar here */}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.firstName}</p>
                <p className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        )}
      </div>
    </header>
  );
};