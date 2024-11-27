import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color:#649DC6;
  color: white;
  text-align: center;
  padding: 15px;
  position: fixed;
  width: 100%;
  bottom: 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Event Management. All rights reserved.</p>
    </FooterContainer>
  );
}

export default Footer;
