import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types';
import type { UserResource } from '@clerk/types';

interface ChatbotPageProps {
  user: UserResource | null;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock query history
  const [queryHistory] = useState([
    { id: '1', query: 'What is our vacation policy?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', query: 'How do I submit an expense report?', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: '3', query: 'What are the remote work guidelines?', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: '4', query: 'Company holiday schedule 2024', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: '5', query: 'How to request time off?', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "Based on your HR policies document, employees are entitled to 15 days of paid vacation per year, which can be carried over to the next year with manager approval.",
          source: "Google Docs > HR_Policies.docx"
        },
        {
          content: "According to the employee handbook, the remote work policy allows up to 3 days per week of remote work with prior approval from your direct supervisor.",
          source: "Notion > Employee Handbook"
        },
        {
          content: "The expense reimbursement process requires submitting receipts through the finance portal within 30 days of the expense date. Approval typically takes 3-5 business days.",
          source: "Google Drive > Finance > Expense_Policy.pdf"
        },
        {
          content: "Company holidays for 2024 include New Year's Day, Memorial Day, Independence Day, Labor Day, Thanksgiving, and Christmas Day. Additional floating holidays may be available based on your location.",
          source: "Notion > Company Calendar"
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        source: randomResponse.source,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
        </div>

        {/* Query History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {queryHistory.map((query) => (
              <div
                key={query.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => setMessage(query.query)}
              >
                <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                  {query.query}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(query.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-500">Ask me anything about your internal docs</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ask me anything about your docs
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  I can help you find information from your connected Google Drive, Google Docs, and Notion documents.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      {msg.source && (
                        <div className="mt-2 px-2">
                          <p className="text-xs text-gray-500 flex items-center space-x-1">
                            <span>📄</span>
                            <span>Sourced from: {msg.source}</span>
                          </p>
                        </div>
                      )}
                      <div className={`mt-1 px-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <p className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl">
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question…"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};