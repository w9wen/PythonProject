import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const NavContainer = styled.nav`
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo>Pi Web App</Logo>
        
        {isAuthenticated ? (
          <NavLinks>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/chat">Chat</NavLink>
            <NavLink to="/ai-demo">AI Demo</NavLink>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </NavLinks>
        ) : (
          <NavLinks>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </NavLinks>
        )}
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;
