import styled, {keyframes} from 'styled-components';
import Logo from './Logo';
import Input from './Input';
import Card from './Card';

export {Logo, Input, Card};

export const Button = styled.button`
  border: none;
  background: ${props => props.destructive ? 'darkred' : 'forestgreen'};
  color: white;
  padding: 16px 32px;
  font-size: 1em;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 4px;
`

const slideInOut = props => keyframes`
  from {
    opacity: ${props.in ? 0 : 1};
    transform: translateY(${props.in ? 0 : -50}px);
  }
  
  to {
    opacity: ${props.in ? 1 : 0};
    transform: translateY(${props.in ? -50 : 0}px);
  }
`;

export const SlideInOut = styled.div`
  animation: ${slideInOut} 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
`;