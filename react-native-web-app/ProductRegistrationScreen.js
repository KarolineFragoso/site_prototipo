import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView, FlatList } from 'react-native';

export default function ProductRegistrationScreen({ onBack }) {
  const [name, setName] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);

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

  const handleSubmit = async () => {
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
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
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
        Alert.alert('Erro', 'Erro ao cadastrar produto: ' + (errorData.error || response.statusText));
        return;
      }
      setName('');
      setRetailPrice('');
      setWholesalePrice('');
      setQuantity('');
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar produto: ' + error.message);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productText}>{item.name}</Text>
      <Text style={styles.productText}>Preço Varejo: R$ {parseFloat(item.retail_price).toFixed(2)}</Text>
      <Text style={styles.productText}>Preço Atacado: R$ {parseFloat(item.wholesale_price).toFixed(2)}</Text>
      <Text style={styles.productText}>Quantidade: {item.quantity}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Produtos</Text>
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
      <Button title="Cadastrar Produto" onPress={handleSubmit} />
      {products.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhum produto cadastrado.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          style={styles.productList}
        />
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
  productList: {
    marginTop: 20,
  },
});
