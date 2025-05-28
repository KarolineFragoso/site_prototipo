
import API_URL from './config';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,
  ScrollView, Platform
} from 'react-native';

export default function SalesScreen({ onBack }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [priceType, setPriceType] = useState('retail');
  const [amountReceived, setAmountReceived] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar produtos');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPrice = (product) =>
    priceType === 'retail' ? product.retail_price : product.wholesale_price;

  const handleSubmit = async () => {
    if (!selectedProductId || !quantity || !amountReceived) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const qty = parseInt(quantity);
    const received = parseFloat(amountReceived);
    const product = products.find(p => p.id === selectedProductId);
    const price = getPrice(product);
    const total = price * qty;

    if (isNaN(qty) || qty < 1 || isNaN(received) || received < total) {
      Alert.alert('Erro', 'Verifique os valores inseridos.');
      return;
    }

    const change = received - total;

    try {
      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProductId,
          quantity: qty,
          price_type: priceType,
          amount_received: received,
          change
        }),
      });

      if (!response.ok) {
        Alert.alert('Erro', 'Falha ao registrar a venda.');
        return;
      }

      setQuantity('');
      setAmountReceived('');
      setSelectedProductId(null);
      Alert.alert('Sucesso', `Venda registrada! Troco: R$ ${change.toFixed(2)}`);
      fetchProducts();
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>Fazer Vendas</Text>

      <TextInput
        style={styles.input}
        placeholder="Pesquisar produto"
        placeholderTextColor="#999"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Text style={styles.label}>Produto</Text>
      {filteredProducts.map(product => (
        <TouchableOpacity
          key={product.id}
          style={[
            styles.productItem,
            selectedProductId === product.id && styles.selectedProduct
          ]}
          onPress={() => setSelectedProductId(product.id)}
        >
          <Text style={styles.productText}>{product.name}</Text>
          <Text style={styles.productText}>
            Preço {priceType === 'retail' ? 'Varejo' : 'Atacado'}: R$ {getPrice(product).toFixed(2)}
          </Text>
          <Text style={styles.productText}>Estoque: {product.quantity}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Tipo de Preço</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.priceButton,
            priceType === 'retail' && styles.priceButtonSelected
          ]}
          onPress={() => setPriceType('retail')}
        >
          <Text style={styles.priceButtonText}>Varejo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.priceButton,
            priceType === 'wholesale' && styles.priceButtonSelected
          ]}
          onPress={() => setPriceType('wholesale')}
        >
          <Text style={styles.priceButtonText}>Atacado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        placeholderTextColor="#999"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Valor Recebido (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor Recebido"
        placeholderTextColor="#999"
        value={amountReceived}
        onChangeText={setAmountReceived}
        keyboardType="numeric"
      />

      {selectedProductId && quantity && amountReceived ? (
        <View style={styles.changeBox}>
          <Text style={styles.changeText}>
            Troco: R$ {(parseFloat(amountReceived) - getPrice(products.find(p => p.id === selectedProductId)) * parseInt(quantity)).toFixed(2)}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar Venda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={onBack}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6a0dad',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  label: {
    color: '#dcdcdc',
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#6a0dad',
    marginBottom: 15,
  },
  productItem: {
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedProduct: {
    borderColor: '#6a0dad',
    borderWidth: 2,
  },
  productText: {
    color: '#dcdcdc',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  priceButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6a0dad',
  },
  priceButtonSelected: {
    backgroundColor: '#6a0dad',
  },
  priceButtonText: {
    color: '#dcdcdc',
    fontWeight: '600',
    fontSize: 16,
  },
  changeBox: {
    backgroundColor: '#004d00',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  changeText: {
    color: '#00ff00',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6a0dad',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backLink: {
    alignSelf: 'center',
    marginTop: 10,
  },
  backText: {
    color: '#6a0dad',
    fontWeight: '600',
    fontSize: 16,
  },
});