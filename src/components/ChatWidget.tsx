import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types';

interface ChatWidgetProps {
  onSendMessage: (message: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onSendMessage }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
      title="Open AI Assistant"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};