import React from 'react';
import renderer from 'react-test-renderer';

import {ReviewForm} from './review-form.jsx';


it(`ReviewForm correctly renders`, () => {
  const reviewForm = renderer
    .create(<ReviewForm
      disabled={false}
      id={5}
      isCommentSending={false}
      onChange={jest.fn()}
      onSendComment={jest.fn()}
      rating={`3`}
      review={`test`}
    />)
    .toJSON();

  expect(reviewForm).toMatchSnapshot();
});
