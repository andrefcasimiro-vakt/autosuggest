import { useState } from 'react';

import { debounce } from 'throttle-debounce';

/**
 * Hook to provide input state functionality
 */
export default function useWithOpen() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = debounce(250, () => setIsOpen(false));

  return {
    isOpen,
    handleOpen,
    handleClose,
  };
}
