import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { MemoryRouter } from 'react-router-dom';

describe('Sidebar', () => {
  test('renders sidebar component', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    const sidebarElement = screen.getByText('Home');
    expect(sidebarElement).toBeInTheDocument();
  });
});
