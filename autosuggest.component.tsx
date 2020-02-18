/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import AutosuggestProps from './autosuggest.props';
import SearchIcon from './icons/search';
import { isValid } from './autosuggest.helpers';
import useKeyboardScroll from './modules/useKeyboardScroll';
import useList from './modules/useList';
import {
  Container,
  InputWrapper,
  Input,
  Relative,
  Panel,
  Option,
  IconWrapper,
} from './autosuggest.style';
import useInputValue from './modules/useInputValue';
import useWithOpen from './modules/useWithOpen';

const Autosuggest = ({ options, selector }: AutosuggestProps) => {
  const [filteredList, setFilteredList] = useState(options);

  // Open Logic
  const { isOpen, handleOpen, handleClose } = useWithOpen();

  // Input
  const { setInputValue, getInputProps } = useInputValue({ handleOpen, handleClose, selector });

  // List
  const { filterList } = useList({ options, onFilter: setFilteredList, selector, onInputChange: setInputValue });

  // Keyboard Scroll
  const { getRootProps, getListboxProps, getOptionProps } = useKeyboardScroll({
    currentList: filteredList,
    onInputChange: setInputValue,
  });

  // Attach keyboard scroll events
  useEffect(() => {
    const { handleKeyDown } = getRootProps();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredList])

  return (
    <Container isOpen={isOpen}>
      {/* Input */}
      <InputWrapper>
        <Input
          isOpen={isOpen}
          onChange={filterList}
          {...getInputProps()}
        />
        <IconWrapper isOpen={isOpen}>
          <SearchIcon />
        </IconWrapper>
      </InputWrapper>

      {/* List */}
      <Relative>
        {isOpen &&
          <Panel {...getListboxProps()}>
            {filteredList.map((item, index) => (
              <Option {...getOptionProps(index)}>
                {isValid(item)
                  ? item
                  : (selector && item[selector])
                }
              </Option>
            ))}
          </Panel>
        }
      </Relative>
    </Container>
  );
}

export default Autosuggest;
