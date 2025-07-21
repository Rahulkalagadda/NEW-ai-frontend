import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ChatbotPage } from './components/ChatbotPage';
import { Connection, QueryLog } from './types';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import type { UserResource } from '@clerk/types';

const DEFAULT_CONNECTIONS: Connection[] = [
  { id: '1', name: 'Google Drive', type: 'google-drive', connected: false },
  { id: '2', name: 'Google Docs', type: 'google-docs', connected: false },
  { id: '3', name: 'Notion', type: 'notion', connected: false },
];

type ExtendedQueryLog = Omit<QueryLog, 'sourceType'> & { sourceType: string };

function App() {
  const clerkUser = useUser();
  const user = clerkUser.user ?? null;
  const [connections, setConnections] = useState<Connection[]>(DEFAULT_CONNECTIONS);
  const [queryLogs, setQueryLogs] = useState<ExtendedQueryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API utility functions inside the component to access getToken
  const fetchConnections = async () => {
    if (!user || typeof (user as any).getToken !== 'function') return [];
    const token = await (user as any).getToken();
    const res = await fetch('/index/connections', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to fetch connections');
    return res.json();
  };

  const fetchQueryLogs = async () => {
    if (!user || typeof (user as any).getToken !== 'function') return [];
    const token = await (user as any).getToken();
    const res = await fetch('/index/query-logs', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to fetch query logs');
    return res.json();
  };

  const sendChatMessage = async (query: string) => {
    if (!user || typeof (user as any).getToken !== 'function') return { answer: '' };
    const token = await (user as any).getToken();
    const res = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchConnections().catch(() => []),
      fetchQueryLogs().catch(() => [])
    ])
      .then(([conns, logs]) => {
        // Merge backend connections with defaults to always show all three
        const mergedConnections = DEFAULT_CONNECTIONS.map(defaultConn => {
          const found = conns.find((c: Connection) => c.type === defaultConn.type);
          return found ? { ...defaultConn, ...found } : defaultConn;
        });
        setConnections(mergedConnections);
        setQueryLogs(
          logs && logs.length
            ? logs
            : [
                { id: '1', query: 'What is our vacation policy?', response: 'Employees are entitled to 15 days of paid vacation per year, which can be carried over to the next year with manager approval.', source: 'HR_Policies.docx', sourceType: 'google-docs', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
                { id: '2', query: 'How do I submit an expense report?', response: 'Submit receipts through the finance portal within 30 days. Approval takes 3-5 business days.', source: 'Expense_Policy.pdf', sourceType: 'google-drive', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                { id: '3', query: 'What are the remote work guidelines?', response: 'Remote work is allowed up to 3 days per week with prior supervisor approval. Core hours are 9 AM - 3 PM.', source: 'Employee Handbook', sourceType: 'notion', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
              ]
        );
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleConnect = (id: string) => {
    setConnections(prev => prev.map(conn =>
      conn.id === id
        ? { ...conn, connected: true, connectedAt: new Date() }
        : conn
    ));
  };

  const handleSendMessage = async (message: string) => {
    setLoading(true);
    try {
      const data = await sendChatMessage(message);
      const newLog: ExtendedQueryLog = {
        id: Date.now().toString(),
        query: message,
        response: data.answer,
        source: 'ChromaDB',
        sourceType: 'vector-db',
        timestamp: new Date(),
      };
      setQueryLogs(prev => [newLog, ...prev]);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <div className="fixed top-0 left-0 w-full bg-blue-100 text-blue-800 text-center py-2 z-50">Loading...</div>}
      {error && <div className="fixed top-0 left-0 w-full bg-red-100 text-red-800 text-center py-2 z-50">{error}</div>}
      <SignedIn>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Header user={user ?? null} />
            <UserButton afterSignOutUrl="/sign-in" />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    connections={connections}
                    queryLogs={queryLogs as QueryLog[]}
                    onConnect={handleConnect}
                    onSendMessage={handleSendMessage}
                  />
                }
              />
              <Route
                path="/chatbot"
                element={user ? <ChatbotPage user={user} /> : <Navigate to="/dashboard" replace />}
              />
            </Routes>
          </div>
        </Router>
      </SignedIn>
      <SignedOut>
        <Router>
          <Routes>
            <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </Router>
      </SignedOut>
    </>
  );
}

export default App;