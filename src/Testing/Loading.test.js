import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Loading from '../Components/Loading';
import '../Design/Loading.css';
import '@testing-library/jest-dom/extend-expect';

describe('Loading', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the message when provided', () => {
    const { getByText } = render(<Loading message='Loading...' />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('does not render the message when not provided', () => {
    const { queryByTestId } = render(<Loading />);
    expect(queryByTestId('message')).toBeNull();
  });
});
