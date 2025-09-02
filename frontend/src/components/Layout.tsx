import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const Layout: React.FC = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <Content>
        <Outlet />
      </Content>
    </LayoutContainer>
  );
};

export default Layout;
