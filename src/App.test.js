import { render, screen } from '@testing-library/react';
import App from './components/App';

test('renders the RUB orders dashboard', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /rub/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /pedidos hoy/i })).toBeInTheDocument();
  expect(screen.getByText(/pedidos activos/i)).toBeInTheDocument();
});
