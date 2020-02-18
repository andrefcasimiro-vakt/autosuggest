/* eslint-disable no-restricted-imports */
import { isValid } from '../autosuggest.helpers';

/**
 * Hook to provide input state functionality
 */
export default function useList(props: Props) {
  const {
    options, onFilter, selector, onInputChange
  } = props;

  const filterList = (event: any): any => {
    const { value } = event.target;

    const lowerCaseValue: string = value.toLowerCase();

    const newList = options
      .slice()
      .filter((item: any) => (isValid(item)
        ? (`${item}`).toLowerCase().includes(lowerCaseValue)
        : selector && (item[selector].toLowerCase()).includes(lowerCaseValue)));

    onFilter(newList);

    onInputChange(value);
  };

  return {
    filterList,
  };
}

type Props = {
  options: any[],
  onFilter: any,
  selector: string | undefined,
  onInputChange: (e: any) => any,
}
