import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SalesReportScreen from '../SalesReportScreen';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('SalesReportScreen', () => {
  it('renders correctly and displays sales', async () => {
    const onBackMock = jest.fn();
    const sales = [
      { id: 1, product: 'Produto 1', quantity: 3, total_price: 30, date: '2023-01-01', time: '10:00' },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sales,
    });

    const { getByText } = render(<SalesReportScreen onBack={onBackMock} />);

    await waitFor(() => {
      expect(getByText('Produto: Produto 1')).toBeTruthy();
      expect(getByText('Quantidade: 3')).toBeTruthy();
      expect(getByText('Preço Total: R$ 30.00')).toBeTruthy();
      expect(getByText('Data: 2023-01-01')).toBeTruthy();
      expect(getByText('Hora: 10:00')).toBeTruthy();
    });
  });
});
