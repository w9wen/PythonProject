import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { createWebSocketConnection } from '../api/api';

const ChatContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const MessagesContainer = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f8f9fa;
`;

const MessageBubble = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  max-width: 70%;
  word-break: break-word;
  
  ${props => props.isSelf ? `
    background-color: #0d6efd;
    color: white;
    margin-left: auto;
  ` : `
    background-color: #e9ecef;
    color: #333;
    margin-right: auto;
  `}
`;

const SenderName = styled.div`
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  color: #666;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0b5ed7;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ConnectionStatus = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  
  ${props => props.connected ? `
    background-color: #d1e7dd;
    color: #0f5132;
  ` : `
    background-color: #f8d7da;
    color: #842029;
  `}
`;

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!token) return;

    const ws = createWebSocketConnection(token);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages(prev => [...prev, data]);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };
    
    return () => {
      ws.close();
    };
  }, [token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;
    
    const messageData = {
      message: newMessage,
      sender: user.username,
      timestamp: new Date().toISOString()
    };
    
    socket.send(JSON.stringify(messageData));
    setNewMessage('');
  };

  return (
    <ChatContainer>
      <Title>Real-time Chat</Title>
      
      <ConnectionStatus connected={connected}>
        {connected ? 'Connected to chat' : 'Disconnected from chat'}
      </ConnectionStatus>
      
      <MessagesContainer>
        {messages.map((msg, index) => (
          <div key={index}>
            <SenderName>{msg.sender}</SenderName>
            <MessageBubble isSelf={msg.sender === user?.username}>
              {msg.message}
            </MessageBubble>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <MessageInput
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!connected}
        />
        <SendButton type="submit" disabled={!connected || !newMessage.trim()}>
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
