import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import InfoCard from '../Components/InfoCard';
import '@testing-library/jest-dom/extend-expect';


describe('InfoCard', () => {
    const question = 'What is the capital of France?';
    const type = 'MC';
    const answer = 'Paris';
    const options = [
      { option: 'London', isAnswer: false },
      { option: 'Paris', isAnswer: true },
      { option: 'Berlin', isAnswer: false },
      { option: 'Madrid', isAnswer: false },
    ];
    const props = { question, type, answer, options };
    const handleChildMock = jest.fn();
  
    afterEach(() => {
      cleanup();
      jest.resetAllMocks();
    });
  
    it('renders question, type, and answer if present', () => {
      render(<InfoCard props={props} />);
      expect(screen.getByText(question)).toBeInTheDocument();
      expect(screen.getByText('Multiple Choice')).toBeInTheDocument();
      expect(screen.getByText(`Answer: ${answer}`)).toBeInTheDocument();
    });
  
    it('renders options if present', () => {
      render(<InfoCard props={props} />);
      expect(screen.getByText((content, element) => content.endsWith('Paris'))).toBeInTheDocument();
    });
  
    it('calls handleChild when the select button is clicked', () => {
      render(<InfoCard props={props} handleChild={handleChildMock} />);
      const selectButton = screen.getByRole('button', { name: 'Select' });
      act(() => {
        selectButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(handleChildMock).toHaveBeenCalledTimes(1);
      expect(handleChildMock).toHaveBeenCalledWith(props);
    });
  
    it('expands and collapses the card when the expand button is clicked', () => {
      render(<InfoCard props={props} />);
      const expandButton = screen.getByLabelText('show more');
      expect(expandButton).toBeInTheDocument();
      expect(screen.queryByText('Options')).not.toBeInTheDocument();
      act(() => {
        expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(screen.getByText('Options')).toBeInTheDocument();
      act(() => {
        expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(screen.queryByText('Options')).toBeInTheDocument();
    });
});
  

