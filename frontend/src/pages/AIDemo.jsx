import { useState } from 'react';
import styled from 'styled-components';
import { api } from '../api/api';

const AIContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 100px;
  font-family: inherit;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
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

const ResponseContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #0d6efd;
  white-space: pre-wrap;
`;

const AIDemo = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('openai'); // 'openai' or 'langchain'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      let result;
      if (method === 'openai') {
        result = await api.generateAIResponse(prompt);
      } else {
        result = await api.generateLangchainResponse(prompt);
      }
      setResponse(result.data.text);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setResponse('Error: Failed to generate response. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIContainer>
      <Title>AI Demo</Title>
      <Subtitle>Experience the power of AI. Ask a question or request information.</Subtitle>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="prompt">Enter your prompt:</Label>
            <TextArea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything..."
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>AI Model:</Label>
            <div>
              <input
                type="radio"
                id="openai"
                name="method"
                value="openai"
                checked={method === 'openai'}
                onChange={() => setMethod('openai')}
              />
              <label htmlFor="openai" style={{ marginLeft: '0.5rem' }}>OpenAI</label>
              
              <input
                type="radio"
                id="langchain"
                name="method"
                value="langchain"
                checked={method === 'langchain'}
                onChange={() => setMethod('langchain')}
                style={{ marginLeft: '1.5rem' }}
              />
              <label htmlFor="langchain" style={{ marginLeft: '0.5rem' }}>LangChain</label>
            </div>
          </FormGroup>
          
          <ButtonGroup>
            <Button type="submit" disabled={loading || !prompt.trim()}>
              {loading ? 'Generating...' : 'Generate Response'}
            </Button>
            <Button 
              type="button" 
              onClick={() => setPrompt('')}
              disabled={loading || !prompt.trim()}
              style={{ backgroundColor: '#6c757d' }}
            >
              Clear
            </Button>
          </ButtonGroup>
        </form>
      </Card>
      
      {response && (
        <div>
          <h2>AI Response:</h2>
          <ResponseContainer>{response}</ResponseContainer>
        </div>
      )}
    </AIContainer>
  );
};

export default AIDemo;
