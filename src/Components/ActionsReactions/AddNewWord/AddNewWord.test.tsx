import { render, screen, fireEvent } from '@testing-library/react';
import { AddNewWord } from './AddNewWord';

export enum ActionType {
    WORD_DETECT = "WORD_DETECT",
    APP_LAUNCH = "APP_LAUNCH",
    KEY_PRESSED = "KEY_PRESSED",
  }

let sources = [{}]

let newEvent = {
    id: 0,
    keywords: [],
    source: {},
  }

// Mock the toast function
jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

describe('AddNewWord', () => {
  test('renders component', () => {
    render(<AddNewWord
        addNewEvent={null}
        sources={sources}
        newEvent={newEvent}
        setnewEvent={null}
    />);
    expect(screen.getByText('Click to add new Word Detection Event')).toBeInTheDocument();
  });
});
