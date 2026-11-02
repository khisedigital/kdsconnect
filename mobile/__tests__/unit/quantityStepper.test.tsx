import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import {QuantityStepper} from '../../src/components/ui/QuantityStepper';

describe('QuantityStepper', () => {
  it('increments within bounds', async () => {
    const onChange = jest.fn();
    const screen = await render(
      <QuantityStepper value={5} min={1} max={10} onChange={onChange} />,
    );

    fireEvent.press(screen.getByLabelText('Increase quantity'));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('decrements within bounds', async () => {
    const onChange = jest.fn();
    const screen = await render(
      <QuantityStepper value={5} min={1} max={10} onChange={onChange} />,
    );

    fireEvent.press(screen.getByLabelText('Decrease quantity'));
    expect(onChange).toHaveBeenCalledWith(4);
  });
});
