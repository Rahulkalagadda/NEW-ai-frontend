import React from 'react';
import { ConnectionCard } from './ConnectionCard';
import { QueryLogsTable } from './QueryLogsTable';
import { ChatWidget } from './ChatWidget';
import { Connection, QueryLog } from '../types';

interface DashboardProps {
  connections: Connection[];
  queryLogs: QueryLog[];
  onConnect: (id: string) => void;
  onSendMessage: (message: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  connections,
  queryLogs,
  onConnect,
  onSendMessage,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-y-12 lg:flex-row lg:gap-x-8">
        {/* Left: Source Integration and Query Logs */}
        <div className="flex-1 flex flex-col gap-y-12">
          {/* Source Integration Section */}
          <section className="bg-white rounded-2xl shadow ring-1 ring-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Source Integration</h2>
              <p className="text-gray-600">Connect your data sources to enable AI-powered search</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onConnect={onConnect}
                />
              ))}
            </div>
          </section>

          {/* Query Logs Section */}
          <section className="bg-white rounded-2xl shadow ring-1 ring-gray-100 p-8">
            <QueryLogsTable logs={queryLogs} />
          </section>
        </div>

        {/* Right: Chat Widget (sticky on large screens) */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24">
            <ChatWidget onSendMessage={onSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};