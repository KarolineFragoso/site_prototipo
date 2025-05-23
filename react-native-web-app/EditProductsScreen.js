import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';

export default function EditProductsScreen({ onBack }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const API_URL = 'https://joaozinho-celular.onrender.com';

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

  const startEditing = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setRetailPrice(product.retail_price.toString());
    setWholesalePrice(product.wholesale_price.toString());
    setQuantity(product.quantity.toString());
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setName('');
    setRetailPrice('');
    setWholesalePrice('');
    setQuantity('');
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome do produto.');
      return;
    }
    const retail = parseFloat(retailPrice);
    if (isNaN(retail) || retail < 0) {
      Alert.alert('Erro', 'Por favor, insira um preço de varejo válido.');
      return;
    }
    const wholesale = parseFloat(wholesalePrice);
    if (isNaN(wholesale) || wholesale < 0) {
      Alert.alert('Erro', 'Por favor, insira um preço de atacado válido.');
      return;
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      Alert.alert('Erro', 'Por favor, insira uma quantidade válida.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          retail_price: retail,
          wholesale_price: wholesale,
          quantity: qty,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Erro', 'Erro ao atualizar produto: ' + (errorData.error || response.statusText));
        return;
      }
      cancelEditing();
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar produto: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Produtos</Text>
      {editingProduct ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Preço Varejo (R$)"
            value={retailPrice}
            onChangeText={setRetailPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Preço Atacado (R$)"
            value={wholesalePrice}
            onChangeText={setWholesalePrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Button title="Salvar" onPress={handleUpdate} />
          <Button title="Cancelar" onPress={cancelEditing} />
        </>
      ) : (
        products.length === 0 ? (
          <Text style={styles.emptyMessage}>Nenhum produto cadastrado.</Text>
        ) : (
          products.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <Text style={styles.productText}>{product.name}</Text>
              <Text style={styles.productText}>Preço Varejo: R$ {parseFloat(product.retail_price).toFixed(2)}</Text>
              <Text style={styles.productText}>Preço Atacado: R$ {parseFloat(product.wholesale_price).toFixed(2)}</Text>
              <Text style={styles.productText}>Quantidade: {product.quantity}</Text>
              <Button title="Editar" onPress={() => startEditing(product)} />
            </View>
          ))
        )
      )}
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
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#6a0dad',
    borderWidth: 1,
  },
  productItem: {
    backgroundColor: '#121212',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  productText: {
    color: '#dcdcdc',
  },
  emptyMessage: {
    color: '#9a7ed1',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
