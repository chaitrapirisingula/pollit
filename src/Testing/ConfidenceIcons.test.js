import React from 'react';
import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react';
import { customIcons, labelledIcons } from '../Components/ConfidenceIcons';

describe('customIcons', () => {
  it('renders the very dissatisfied icon with the correct label', () => {
    const { icon, label } = customIcons[1];
    const { getByLabelText } = render(<div aria-label={label}>{icon}</div>);
    expect(getByLabelText(label)).toBeInTheDocument();
    cleanup();
  });

  it('renders the dissatisfied icon with the correct label', () => {
    const { icon, label } = customIcons[2];
    const { getByLabelText } = render(<div aria-label={label}>{icon}</div>);
    expect(getByLabelText(label)).toBeInTheDocument();
    cleanup();
  });

  it('renders the satisfied icon with the correct label', () => {
    const { icon, label } = customIcons[3];
    const { getByLabelText } = render(<div aria-label={label}>{icon}</div>);
    expect(getByLabelText(label)).toBeInTheDocument();
    cleanup();
  });

  it('renders the satisfied alt icon with the correct label', () => {
    const { icon, label } = customIcons[4];
    const { getByLabelText } = render(<div aria-label={label}>{icon}</div>);
    expect(getByLabelText(label)).toBeInTheDocument();
    cleanup();
  });

  it('renders the very satisfeid icon with the correct label', () => {
    const { icon, label } = customIcons[5];
    const { getByLabelText } = render(<div aria-label={label}>{icon}</div>);
    expect(getByLabelText(label)).toBeInTheDocument();
    cleanup();
  });
});

describe('labelledIcons', () => {
  it('renders all icons with the correct labels', () => {
    Object.keys(labelledIcons).forEach((label) => {
      const icon = labelledIcons[label];
      const { getByLabelText } = render(<div aria-label={label}>{icon}</div>);
      expect(getByLabelText(label)).toBeInTheDocument();
    });
  });
});
