import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateReactions, ReactionType } from './CreateReactions';
import { MemoryRouter } from 'react-router-dom';

describe('CreateReactions', () => {

  test('renders the component', () => {
    render(
          <MemoryRouter>
            <CreateReactions />
          </MemoryRouter>
        );
    expect(screen.getByText('List of Reactions')).toBeInTheDocument();
  });

  test('opens the dialog when "Add Reaction" button is clicked', () => {
    render(
          <MemoryRouter>
            <CreateReactions />
          </MemoryRouter>
        );
    fireEvent.click(screen.getByText('Add Reaction'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('displays an error toast if name of the reaction is missing', () => {
    render(
          <MemoryRouter>
            <CreateReactions />
          </MemoryRouter>
        );
    fireEvent.click(screen.getByText('Add Reaction'));
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Reaction')).toBeInTheDocument();
  });

});