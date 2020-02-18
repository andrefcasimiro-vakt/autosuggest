import React from 'react';

import Autosuggest from './autosuggest.component';
import { Background } from './autosuggest.style';

export default {
  title: 'Design System|Atoms/Autosuggest',
  parameters: {
    component: Autosuggest,
    componentSubtitle: 'Basic autosuggest component'
  }
};

const options = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

export const Basic = () => (
  <Background color="black">
    <Autosuggest options={options} selector="" />
  </Background>
);
