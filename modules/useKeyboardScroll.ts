import React, { useRef } from 'react';

function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    // eslint-disable-next-line no-param-reassign
    ref.current = value;
  }
}

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
*/
function useEventCallback(fn) {
  const ref = React.useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  // @ts-ignore
  return React.useCallback((...args) => (0, ref.current)(...args), []);
}

/**
 * Hook enable keyboard movement on scrollable lists.
 * E. g. Scroll items using keyboard on an autosuggest list.
 *
 * Based on Google's Material UI - Autocomplete Lab
 */
export default function useKeyboardScroll(props: Props) {
  const {
    currentList,
    onInputChange,
  } = props;

  // Used internally to track the currenct active item from the list
  const highlightedIndexRef = useRef(null);

  // Used to track the ul element that contains the <li /> items
  const listboxRef = useRef(null);

  function validOptionIndex(index, direction) {
    const listboxRefCurrent: any = listboxRef.current;

    if (!listboxRefCurrent || index === -1) {
      return -1;
    }

    let nextFocus = index;

    while (true) {
      // Out of range
      if (
        (direction === 'next' && nextFocus === currentList.length - 1)
        || (direction === 'previous' && nextFocus === -1)
      ) {
        return -1;
      }

      const option = listboxRefCurrent.querySelector(`[data-option-index="${nextFocus}"]`);

      // Same logic as MenuList.js
      if (
        option
        && (!option.hasAttribute('tabindex')
          || option.disabled
          || option.getAttribute('aria-disabled') === 'true')
      ) {
        nextFocus += direction === 'next' ? 1 : -1;
      } else {
        return nextFocus;
      }
    }
  }

  function setHighlightedIndex(index) {
    highlightedIndexRef.current = index;


    const listboxRefCurrent: any = listboxRef.current;

    const prev = listboxRefCurrent.querySelector('[data-focus]');
    if (prev) {
      prev.removeAttribute('data-focus');
    }

    const listboxNode = listboxRefCurrent.parentElement.querySelector('[role="listbox"]');

    if (index === -1) {
      listboxNode.scrollTop = 0;
      return;
    }

    const option = listboxRefCurrent.querySelector(`[data-option-index="${index}"]`);

    if (!option) {
      return;
    }

    option.setAttribute('data-focus', 'true');

    // Based on https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox.js
    if (listboxNode.scrollHeight > listboxNode.clientHeight) {
      const element = option;

      const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
      const elementBottom = element.offsetTop + element.offsetHeight;


      if (elementBottom > scrollBottom) {
        listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
      } else if (
        element.offsetTop < listboxNode.scrollTop
      ) {
        listboxNode.scrollTop = element.offsetTop;
      }
    }
  }

  const changeHighlightedIndex = (diff, direction) => {
    const getNextIndex = () => {
      const maxIndex = currentList.length - 1;

      if (diff === 'start') {
        return 0;
      }

      if (diff === 'end') {
        return maxIndex;
      }

      const hightlightedIndexRefCurrent: any = highlightedIndexRef.current;

      const newIndex = hightlightedIndexRefCurrent + diff;

      if (newIndex < 0) {
        if (newIndex === -1) {
          return -1;
        }

        if ((hightlightedIndexRefCurrent !== -1) || Math.abs(diff) > 1) {
          return 0;
        }

        return maxIndex;
      }

      if (newIndex > maxIndex) {
        if (newIndex === maxIndex + 1) {
          return -1;
        }

        if (Math.abs(diff) > 1) {
          return maxIndex;
        }

        return 0;
      }

      return newIndex;
    };

    const nextIndex = validOptionIndex(getNextIndex(), direction);

    setHighlightedIndex(nextIndex);
  };

  const handleListboxRef = useEventCallback(node => {
    setRef(listboxRef, node);

    if (!node) {
      return;
    }

    // Automatically select the first option as the listbox become visible.
    if (highlightedIndexRef.current === -1) {
      changeHighlightedIndex('reset', 'next');
    } else {
      // Restore the focus to the correct option.
      setHighlightedIndex(highlightedIndexRef.current);
    }
  });

  const handleOptionClick = event => {
    const index = Number(event.currentTarget.getAttribute('data-option-index'));

    onInputChange(currentList[index]);

    // selectNewValue(event, filteredOptions[index]);

    // if (
    //   blurOnSelect === true
    //   || (blurOnSelect === 'touch' && isTouch.current)
    //   || (blurOnSelect === 'mouse' && !isTouch.current)
    // ) {
    //   inputRef.current.blur();
    // }

    // isTouch.current = false;
  };

  const handleKeyDown = event => {
    switch (event.key) {
      case 'ArrowDown':
        // Prevent cursor move
        event.preventDefault();
        changeHighlightedIndex(1, 'next');
        break;
      case 'ArrowUp':
        // Prevent cursor move
        event.preventDefault();
        changeHighlightedIndex(-1, 'previous');
        break;
      case 'Enter':
        // Wait until IME is settled.
        if (event.which === 229) {
          break;
        }

        if (highlightedIndexRef.current !== -1) {
          event.preventDefault();

          const index: any = highlightedIndexRef.current;

          onInputChange(currentList[index]);
        }
        break;
      default:
    }
  };

  return {
    getRootProps: () => ({
      handleKeyDown,
    }),
    getListboxProps: () => ({
      role: 'listbox',
      ref: handleListboxRef,
      onMouseDown: event => {
        // Prevent blur
        event.preventDefault();
      },
    }),
    getOptionProps: (index) => ({
      key: index,
      tabIndex: -1,
      role: 'option',
      id: `${index}-option-${index}`,
      'data-option-index': index,
      onClick: handleOptionClick,
    })
  };
}

type Props = {
  /** The actual list. Used for length calculations. */
  currentList: any[],
  /** The onChange callback owned by the input component */
  onInputChange: (e: any) => void,
}
