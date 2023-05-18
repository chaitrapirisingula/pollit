import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import Responses from '../Components/Responses';
import '@testing-library/jest-dom/extend-expect';

describe('Responses', () => {
  afterEach(cleanup);

  it('renders a DataGrid with given data', () => {
    const data = [{ id: 1, user: 'User 1', time: '2022-04-26 14:23:22', answer: 'Answer 1', confidence: 2, question: 'Question 1', score: 0.5 },
                  { id: 2, user: 'User 2', time: '2022-04-26 14:24:15', answer: 'Answer 2', confidence: 1, question: 'Question 2', score: 1 },
                  { id: 3, user: 'User 3', time: '2022-04-26 14:26:30', answer: 'Answer 3', confidence: 5, question: 'Question 3', score: 0.75 }];
    render(<Responses data={data} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBe(data.length + 1);
  });

  it('renders the component', () => {
    render(<Responses data={[]} />);
    const responsesComponent = screen.getByRole('grid');
    expect(responsesComponent).toBeInTheDocument();
  });
});

