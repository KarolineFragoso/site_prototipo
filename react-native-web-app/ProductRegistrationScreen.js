
import API_URL from './config';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

export default function ProductRegistrationScreen({ onBack }) {
  const [name, setName] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);

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
      <Text style={styles.productText}>
        Preço Varejo: R$ {parseFloat(item.retail_price).toFixed(2)}
      </Text>
      <Text style={styles.productText}>
        Preço Atacado: R$ {parseFloat(item.wholesale_price).toFixed(2)}
      </Text>
      <Text style={styles.productText}>Quantidade: {item.quantity}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Produtos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        placeholderTextColor="#9a7ed1"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço Varejo (R$)"
        placeholderTextColor="#9a7ed1"
        value={retailPrice}
        onChangeText={setRetailPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço Atacado (R$)"
        placeholderTextColor="#9a7ed1"
        value={wholesalePrice}
        onChangeText={setWholesalePrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        placeholderTextColor="#9a7ed1"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style={styles.backButtonContainer} onPress={onBack}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a259ff',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#a259ff',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#ffffff',
    marginBottom: 16,
    fontSize: 16,
  },
  productItem: {
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#a259ff',
  },
  productText: {
    color: '#dddddd',
    fontSize: 14,
    marginBottom: 4,
  },
  emptyMessage: {
    color: '#a259ff',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
  productList: {
    marginTop: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    backgroundColor: '#a259ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButtonContainer: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#a259ff',
    fontSize: 14,
    fontWeight: '600',
  },
});