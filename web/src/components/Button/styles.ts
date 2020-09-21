import styled from 'styled-components';

import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9000;
  color: #312e38;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  font-weight: 600;
  margin-top: 16px;
  transition: background-color 0.2;

  &:hover {
    background-color: ${shade(0.2, '#FF9000')};
  }
`;
