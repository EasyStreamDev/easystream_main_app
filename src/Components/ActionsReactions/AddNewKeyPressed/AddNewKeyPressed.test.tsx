import { render, screen, fireEvent } from '@testing-library/react';
import { AddNewKeyPressed } from './AddNewKeyPressed';

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

describe('AddNewKeyPressed', () => {
  test('renders component', () => {
    render(<AddNewKeyPressed
        addNewEvent={null}
        sources={sources}
        newEvent={newEvent}
        setnewEvent={null}
    />);
    expect(screen.getByText('Click to add new Key Pressed Event')).toBeInTheDocument();
  });

  test('shows error toast if no source is selected', () => {
    const toastMock = jest.spyOn(require('react-toastify'), 'toast');
    render(<AddNewKeyPressed
        addNewEvent={null}
        sources={sources}
        newEvent={newEvent}
        setnewEvent={null}
    />);
    fireEvent.click(screen.getByText('Click to add new Key Pressed Event'));
    fireEvent.click(screen.getByText('Save'));
    expect(toastMock).toHaveBeenCalledWith('Please insert at least one source.', { type: 'error' });
  });
});
