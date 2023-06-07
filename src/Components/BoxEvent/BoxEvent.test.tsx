import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BoxEvent from './BoxEvent';

describe('BoxEvent component', () => {
  const mockProps = {
    keyObj: {
      action: {
        type: 'WORD_DETECT',
        params: {
          words: ['word1', 'word2'],
        },
      },
      reactionId: 1,
      reaction: {
        name: 'Reaction Name',
      },
    },
    eventArray: [],
    seteventArray: jest.fn(),
    i: 0,
  };

  test('renders the component with word detection type', () => {
    render(<BoxEvent {...mockProps} />);
  
    // Assert if the text is rendered correctly
    expect(screen.getByText('If you say :')).toBeInTheDocument();
    expect(screen.getByText('[word1]')).toBeInTheDocument();
    expect(screen.getByText('[word2]')).toBeInTheDocument();
    expect(screen.getByText('The reaction :')).toBeInTheDocument();
    expect(screen.getByText('[Reaction Name]')).toBeInTheDocument();
  });

});