import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { QueryLog } from '../types';

interface QueryLogsTableProps {
  logs: QueryLog[];
}

const getSourceIcon = (type: string) => {
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

const getSourceColor = (type: string) => {
  switch (type) {
    case 'google-drive':
      return 'bg-blue-100 text-blue-800';
    case 'google-docs':
      return 'bg-blue-100 text-blue-800';
    case 'notion':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const QueryLogsTable: React.FC<QueryLogsTableProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Query History</h2>
        <p className="text-sm text-gray-500">Recent questions and responses</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Query
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {log.query}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md">
                    <p className="line-clamp-2">{log.response}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getSourceIcon(log.sourceType)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(log.sourceType)}`}>
                      {log.source}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};