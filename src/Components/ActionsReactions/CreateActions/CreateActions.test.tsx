import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CreateActions } from './CreateActions';

describe('CreateActions', () => {
  test('renders page title', () => {
    render(<CreateActions />, { wrapper: MemoryRouter });
    const pageTitle = screen.getByText('Select an action');
    expect(pageTitle).toBeInTheDocument();
  });

  test('renders Word Detection link', () => {
    render(<CreateActions />, { wrapper: MemoryRouter });
    const wordDetectionLink = screen.getByText('Word Detection');
    expect(wordDetectionLink).toBeInTheDocument();
  });

  test('renders Key Pressed link', () => {
    render(<CreateActions />, { wrapper: MemoryRouter });
    const keyPressedLink = screen.getByText('Key Pressed');
    expect(keyPressedLink).toBeInTheDocument();
  });

  test('renders App Launch link', () => {
    render(<CreateActions />, { wrapper: MemoryRouter });
    const appLaunchLink = screen.getByText('App Launch');
    expect(appLaunchLink).toBeInTheDocument();
  });

  test('renders Go Back link', () => {
    render(<CreateActions />, { wrapper: MemoryRouter });
    const goBackLink = screen.getByText('Go Back');
    expect(goBackLink).toBeInTheDocument();
  });
});
