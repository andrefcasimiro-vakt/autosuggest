/* eslint-disable no-restricted-imports */
import { useState, ChangeEvent } from 'react';

/**
 * Hook to provide input state functionality
 */
export default function useInputValue(props: Props) {
  const { handleOpen, handleClose } = props;

  const [inputValue, setInputValue] = useState('');

  return {
    setInputValue,
    getInputProps: () => ({
      onFocus: handleOpen,
      onBlur: handleClose,
      value: inputValue,
    }),
  };
}

type Props = {
  handleOpen: (e: ChangeEvent<HTMLInputElement>) => void,
  handleClose: (e: ChangeEvent<HTMLInputElement>) => void,
  selector: string | undefined,
}
