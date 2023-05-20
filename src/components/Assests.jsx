import styled, { css } from 'styled-components';

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 600;
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.secondaryContrast};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
  
  
  ${props => props.secondary && css`
  background-color: transparent;
  color:  ${props => props.theme.secondary};
  box-shadow: unset;
  box-shadow: inset 0 0 0 2px ${props => props.theme.secondary};
` }

  &:hover:not(:disabled) {
    filter: brightness(120%);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

