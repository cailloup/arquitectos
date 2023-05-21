import styled, { css } from 'styled-components';


export const BodyConainer = styled.main`
background-color: ${props => props.theme.primary};
position: absolute;
display: grid;
top: 72px;
min-height: calc(100% - 72px);
width: 100%;
overflow-x: hidden;

& *{
 
  color:${props => props.theme.generalText};
}


`;

export const Container = styled.div`
  background-color: ${props => props.theme.primary};


`;

export const Input = styled.input`
background-color: ${props => props.theme.primary};
border: none;
border-bottom: solid 2px  ${props => props.theme.secondary};
border-radius: 0;
transition:240ms;
&:hover{
  border: none;
  border-bottom: solid 2px  ${props => props.theme.secondary};
}

&:focus{
  border: none;
  border-bottom: solid 4px  ${props => props.theme.primaryContrast};
}

&:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


${props => props.notDisplay && css`
 display:none;

` }

`;
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
  color:  ${props => props.theme.primaryContrast};
  box-shadow: unset;
  box-shadow: inset 0 0 0 2px ${props => props.theme.primaryContrast};
` }

  &:hover:not(:disabled) {
    filter: brightness(120%);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Nav = styled.nav`
  background-color: ${props => props.theme.secondary};
 
  & *{
    color: ${props => props.theme.secondaryContrast};
    fill: ${props => props.theme.secondaryContrast};
  }
    ${props => props.primary && css`
    background-color: ${props => props.theme.primary};
    & *{
      color: ${props => props.theme.generalText};
      fill: ${props => props.theme.generalText};
    }

  ` }
  `;

  export const Select = styled.select`
  background-color: ${props => props.theme.primary};
  border: none;
  border-bottom: solid 2px  ${props => props.theme.secondary};
  border-radius: 0;
  transition:240ms;
  &:hover{
    border: none;
    border-bottom: solid 2px  ${props => props.theme.secondary};
  }
  
  &:focus{
    border: none;
    border-bottom: solid 4px  ${props => props.theme.primaryContrast};
  }
  
  `;


  export const LeftBar = styled.div`
  background-color: ${props => props.theme.secondary};
  
  `;

  export const LeftBarLine = styled.div`
  background-color: ${props => props.theme.secondaryContrast};
  `;