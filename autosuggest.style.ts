/* eslint-disable no-shadow */
import styled, { css } from 'styled-components';

const theme = {
  primary: '#272A33',
  primaryLight: '#2F3641',
  secondary: '#FFF',
  grey: '#C4C4C4',
  shadow: '#00000029',
};

type StyleProps = {
  isOpen?: boolean,
}

export const Container = styled.div`
  background: none;
  border-radius: none;
  padding: 10px;
  width: 100%;

  ${(p: StyleProps) => p.isOpen && css`
    background: ${theme.primaryLight};
    border-radius: 5px;
  `}
`;

// Input

export const Input = styled.input`
  display: flex;
  background: none;
  width: calc(100% - 8px);
  height: 2.25em;
  line-height: 1.5;
  vertical-align: top;
  border: none;
  border-bottom: 1px solid ${theme.secondary};
  outline: none;
  font-size: 14px;
  color: ${theme.secondary};
  transition: 0.3s ease all;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-left: 8px;

  ${(p: StyleProps) => p.isOpen && css`
    background: ${theme.secondary};
    border-radius: 5px;
    color: ${theme.primary};
  `}
`;

export const IconWrapper = styled.svg`
  color: white;
  position: absolute;
  width: 1.2rem;
  height: 1.2rem;
  align-self: flex-end;
  color: ${(p: StyleProps) => (p.isOpen ? theme.primary : theme.secondary)};
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// Options

export const Relative = styled.div`
  position: relative;
  width: 100%;
  margin-top: 1rem;
`;

export const Panel = styled.ul`
  position: absolute;
  background: ${theme.primaryLight};
  width: 100%;
  max-height: 120px;
  margin-left: -10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;

  margin-top: 0;
  overflow: scroll;

  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const hoverEffect = `
  border-radius: 5px;
  background: ${theme.secondary};
  color: ${theme.primary};
`;

export const Option = styled.li`
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  transition: 0.1s ease all;
  color: ${theme.secondary};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: 1px solid ${theme.secondary};

  cursor: pointer;


  &:hover {
    ${hoverEffect};
  }

  &[data-focus='true'] {
    ${hoverEffect};
  }
`;

// Storybook Presentation Wrapper
export const Background = styled.div`
  background: ${theme.primary};
  padding: 10rem;
`;
