import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Timer from '../Components/Timer';
import '@testing-library/jest-dom/extend-expect';

describe('Timer', () => {
    afterEach(cleanup);
  
    it('should render the component with initial state', () => {
      const { getByText } = render(<Timer posted={new Date()} limit={10000} />);
      expect(getByText('Time remaining:')).toBeInTheDocument();
      expect(screen.getByText((content, element) => content.startsWith('00') && content.endsWith('00'))).toBeInTheDocument();
    });

    it('should render the Timer component with partial time left', () => {
        const posted = new Date(Date.now()); // posted now
        const limit = 60000; // 1 minute limit
        const handleEnd = jest.fn();
        jest.useFakeTimers();
        act(() => {
            render(<Timer posted={posted} limit={limit} handleEnd={handleEnd} />);
        });

        act(() => {
            jest.advanceTimersByTime(30000);
        });
    
        const timerCountdown = screen.getByText((content, element) => content.startsWith('00')); 
        expect(timerCountdown).toBeInTheDocument();
      });
  
      it('should call handleEnd after time limit has passed', () => {
        jest.useFakeTimers();
        const posted = Date.now() - 3000; // 2 seconds ago
        const limit = 2000; // 2 seconds
        const handleEnd = jest.fn();
        render(<Timer posted={posted} limit={limit} handleEnd={handleEnd} />);
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(handleEnd).toHaveBeenCalledTimes(1);
        expect(screen.getByText((content, element) => content.startsWith('Time') && content.endsWith('up!'))).toBeInTheDocument();
      });
  });
  