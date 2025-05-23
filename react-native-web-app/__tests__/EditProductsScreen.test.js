import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProductsScreen from '../EditProductsScreen';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('EditProductsScreen', () => {
  it('renders correctly and updates a product', async () => {
    const onBackMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(<EditProductsScreen onBack={onBackMock} />);

    // Mock products data
    const products = [
      { id: 1, name: 'Produto 1', retail_price: 10, wholesale_price: 8, quantity: 5 },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    // Wait for products to load
    await waitFor(() => getByText('Produto 1'));

    // Start editing
    fireEvent.press(getByText('Editar'));

    const nameInput = getByPlaceholderText('Nome do Produto');
    const retailPriceInput = getByPlaceholderText('Preço Varejo (R$)');
    const wholesalePriceInput = getByPlaceholderText('Preço Atacado (R$)');
    const quantityInput = getByPlaceholderText('Quantidade');
    const saveButton = getByText('Salvar');

    fireEvent.changeText(nameInput, 'Produto Atualizado');
    fireEvent.changeText(retailPriceInput, '12.50');
    fireEvent.changeText(wholesalePriceInput, '10.00');
    fireEvent.changeText(quantityInput, '7');

    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            name: 'Produto Atualizado',
            retail_price: 12.5,
            wholesale_price: 10,
            quantity: 7,
          }),
        })
      );
    });
  });
});
