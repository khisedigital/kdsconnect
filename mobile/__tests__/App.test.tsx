/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import {Text} from '../src/components/ui/Text';

test('design system text renders', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<Text>KDS Connect</Text>);
  });
  expect(tree?.toJSON()).toBeTruthy();
});
