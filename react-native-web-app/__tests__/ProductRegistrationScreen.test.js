import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductRegistrationScreen from '../ProductRegistrationScreen';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('ProductRegistrationScreen', () => {
  it('renders correctly and submits form', async () => {
    const onBackMock = jest.fn();
    const { getByPlaceholderText, getByText } = render(<ProductRegistrationScreen onBack={onBackMock} />);

    const nameInput = getByPlaceholderText('Nome do Produto');
    const retailPriceInput = getByPlaceholderText('Preço Varejo (R$)');
    const wholesalePriceInput = getByPlaceholderText('Preço Atacado (R$)');
    const quantityInput = getByPlaceholderText('Quantidade');
    const submitButton = getByText('Cadastrar Produto');

    fireEvent.changeText(nameInput, 'Produto Teste');
    fireEvent.changeText(retailPriceInput, '10.50');
    fireEvent.changeText(wholesalePriceInput, '8.00');
    fireEvent.changeText(quantityInput, '5');

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Produto Teste',
            retail_price: 10.5,
            wholesale_price: 8,
            quantity: 5,
          }),
        })
      );
    });
  });
});
