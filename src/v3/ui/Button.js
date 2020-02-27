import styled from 'styled-components';

export default styled.button`
  border: none;
  background: ${props => props.destructive ? 'darkred' : 'forestgreen'};
  color: white;
  padding: 16px 32px;
  font-size: 1em;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 4px;
`