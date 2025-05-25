import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';

export default function SalesScreen({ onBack }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState('');
  const API_URL = 'http://localhost:3001';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProductId) {
      Alert.alert('Erro', 'Por favor, selecione um produto.');
      return;
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      Alert.alert('Erro', 'Por favor, insira uma quantidade válida.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProductId,
          quantity: qty,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Erro', 'Erro ao registrar venda: ' + (errorData.error || response.statusText));
        return;
      }
      setSelectedProductId(null);
      setQuantity('');
      Alert.alert('Sucesso', 'Venda registrada com sucesso.');
      // Refresh product list after sale
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao registrar venda: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fazer Vendas</Text>
      <Text style={styles.label}>Selecione o Produto:</Text>
      {products.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhum produto cadastrado.</Text>
      ) : (
        products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[
              styles.productItem,
              selectedProductId === product.id && styles.selectedProduct,
            ]}
            onPress={() => setSelectedProductId(product.id)}
          >
            <Text style={styles.productText}>{product.name}</Text>
            <Text style={styles.productText}>Preço Varejo: R$ {parseFloat(product.retail_price).toFixed(2)}</Text>
            <Text style={styles.productText}>Quantidade: {product.quantity}</Text>
          </TouchableOpacity>
        ))
      )}
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Button title="Registrar Venda" onPress={handleSubmit} />
      <Button title="Voltar" onPress={onBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6a0dad',
    marginBottom: 20,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  label: {
    color: '#dcdcdc',
    marginBottom: 10,
  },
  productItem: {
    backgroundColor: '#121212',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedProduct: {
    borderColor: '#6a0dad',
    borderWidth: 2,
  },
  productText: {
    color: '#dcdcdc',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#6a0dad',
    borderWidth: 1,
  },
  emptyMessage: {
    color: '#9a7ed1',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
