import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Subtitle = styled.h2`
  margin-bottom: 2rem;
  color: #666;
`;

const HomeLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #0d6efd;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  
  &:hover {
    background-color: #0b5ed7;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <p>The page you are looking for does not exist or has been moved.</p>
      <div style={{ marginTop: '2rem' }}>
        <HomeLink to="/">Go to Home</HomeLink>
      </div>
    </NotFoundContainer>
  );
};

export default NotFound;
