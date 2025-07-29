import React from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { Connection } from '../types';

interface ConnectionCardProps {
  connection: Connection;
  onConnect: (id: string) => void;
}

const getConnectionIcon = (type: string) => {
  switch (type) {
    case 'google-drive':
      return '📁';
    case 'google-docs':
      return '📄';
    case 'notion':
      return '📝';
    default:
      return '🔗';
  }
};

const getConnectionColor = (type: string) => {
  switch (type) {
    case 'google-drive':
      return 'from-blue-500 to-blue-600';
    case 'google-docs':
      return 'from-blue-500 to-blue-600';
    case 'notion':
      return 'from-gray-800 to-gray-900';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const handleOAuthConnect = (type: string) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://backendaidocs.vercel.app/';
  let url = '';
  if (type === 'google-drive' || type === 'google-docs') {
    url = `${baseUrl}/oauth/google/login`;
  } else if (type === 'notion') {
    url = `${baseUrl}/oauth/notion/login`;
  }
  if (url) {
    window.location.href = url;
  }
};

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, onConnect }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getConnectionIcon(connection.type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
            <p className="text-sm text-gray-500">
              {connection.connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        {connection.connected && (
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Connected</span>
          </div>
        )}
      </div>

      {!connection.connected ? (
        <button
          onClick={() => handleOAuthConnect(connection.type)}
          className={`w-full bg-gradient-to-r ${getConnectionColor(connection.type)} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
        >
          <ExternalLink className="w-4 h-4" />
          <span>Connect {connection.name}</span>
        </button>
      ) : (
        <div className="text-center py-3">
          <p className="text-sm text-gray-500">
            Connected {connection.connectedAt && new Date(connection.connectedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};
