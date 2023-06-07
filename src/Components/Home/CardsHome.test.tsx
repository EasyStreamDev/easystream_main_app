import React from 'react';
import { render, screen } from '@testing-library/react';
import OutlinedCard from './CardsHome';

describe('OutlinedCard component', () => {
  test('renders title and description correctly', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    render(<OutlinedCard title={title} description={description} />);

    const titleElement = screen.getByText(title);
    const descriptionElement = screen.getByText(description);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });
});
