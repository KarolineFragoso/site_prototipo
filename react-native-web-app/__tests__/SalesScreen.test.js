import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SalesScreen from '../SalesScreen';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('SalesScreen', () => {
  it('renders correctly and registers a sale', async () => {
    const onBackMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(<SalesScreen onBack={onBackMock} />);

    // Mock products data
    const products = [
      { id: 1, name: 'Produto 1', retail_price: 10, quantity: 5 },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    // Wait for products to load
    await waitFor(() => getByText('Produto 1'));

    // Select product
    fireEvent.press(getByText('Produto 1'));

    const quantityInput = getByPlaceholderText('Quantidade');
    const registerButton = getByText('Registrar Venda');

    fireEvent.changeText(quantityInput, '3');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/sales'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            product_id: 1,
            quantity: 3,
          }),
        })
      );
    });
  });
});
