import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';
import axios from 'axios';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
jest.mock('axios');

test('renders the app and checks initial state', async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<App />);

  expect(screen.getByText(/SpiderGlimpse/i)).toBeInTheDocument();
  expect(screen.getByText(/Todos/i)).toBeInTheDocument();
  expect(screen.getByText(/Más de 5 palabras \(Ordenar por comentarios\)/i)).toBeInTheDocument();
  expect(screen.getByText(/Menos de o igual a 5 palabras \(Ordenar por puntos\)/i)).toBeInTheDocument();
});

test('fetches and displays entries', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { number: 1, title: 'Story 1', points: 10, comments: 5 },
      { number: 2, title: 'Story 2', points: 20, comments: 10 },
    ]
  });

  render(<App />);

  expect(await screen.findByText(/Story 1/i)).toBeInTheDocument();
  expect(screen.getByText(/10 points/i)).toBeInTheDocument();
  expect(screen.getByText(/5 comments/i)).toBeInTheDocument();
});

test('filters by comments correctly', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { number: 1, title: 'A long story title', points: 10, comments: 5 },
      { number: 2, title: 'Short title', points: 20, comments: 10 },
    ]
  });

  render(<App />);

  fireEvent.click(screen.getByText(/Más de 5 palabras \(Ordenar por comentarios\)/i));

  await waitFor(() => {
    expect(screen.getByText(/A long story title/i)).toBeInTheDocument();
    expect(screen.queryByText(/Short title/i)).toBeNull();
  });
});

test('filters by points correctly', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { number: 1, title: 'Short title', points: 10, comments: 5 },
      { number: 2, title: 'A long story title', points: 20, comments: 10 },
    ]
  });

  render(<App />);

  fireEvent.click(screen.getByText(/Menos de o igual a 5 palabras \(Ordenar por puntos\)/i));

  await waitFor(() => {
    expect(screen.getByText(/A long story title/i)).toBeInTheDocument();
    expect(screen.queryByText(/Short title/i)).toBeNull();
  });
});