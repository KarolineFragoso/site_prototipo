import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView
} from 'react-native';

export default function EditProductsScreen({ onBack }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';


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
    const wholesale = parseFloat(wholesalePrice);
    const qty = parseInt(quantity);

    if (isNaN(retail) || retail < 0 || isNaN(wholesale) || wholesale < 0 || isNaN(qty) || qty < 0) {
      Alert.alert('Erro', 'Valores inválidos.');
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

  const handleDelete = async () => {
    if (!editingProduct) return;
    try {
      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Erro', 'Erro ao excluir produto: ' + (errorData.error || response.statusText));
        return;
      }
      cancelEditing();
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir produto: ' + error.message);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Produtos</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar produto"
        placeholderTextColor="#999"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {editingProduct ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Preço Varejo (R$)"
            placeholderTextColor="#999"
            value={retailPrice}
            onChangeText={setRetailPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Preço Atacado (R$)"
            placeholderTextColor="#999"
            value={wholesalePrice}
            onChangeText={setWholesalePrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            placeholderTextColor="#999"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate}>
            <Text style={styles.btnText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.submitBtn, styles.deleteBtn]} onPress={handleDelete}>
            <Text style={styles.btnText}>Excluir Produto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.submitBtn, styles.cancelBtn]} onPress={cancelEditing}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhum produto cadastrado.</Text>
      ) : (
        filteredProducts.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <Text style={styles.productText}>{product.name}</Text>
            <Text style={styles.productText}>
              Varejo: R$ {parseFloat(product.retail_price).toFixed(2)}
            </Text>
            <Text style={styles.productText}>
              Atacado: R$ {parseFloat(product.wholesale_price).toFixed(2)}
            </Text>
            <Text style={styles.productText}>Qtd: {product.quantity}</Text>

            <TouchableOpacity style={styles.editBtn} onPress={() => startEditing(product)}>
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity onPress={onBack} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6a0dad',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6a0dad',
    marginBottom: 16,
    fontSize: 16,
  },
  productItem: {
    backgroundColor: '#121212',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#6a0dad',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  productText: {
    color: '#dcdcdc',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6a0dad',
    marginBottom: 16,
    fontSize: 16,
  },
  form: {
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#6a0dad',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtn: {
    backgroundColor: '#6a0dad',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
  },
  cancelBtn: {
    backgroundColor: '#dc3545',
  },
  editBtn: {
    backgroundColor: '#7e3edb',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#9a7ed1',
    fontStyle: 'italic',
    padding: 20,
  },
  backLink: {
    marginTop: 24,
    alignSelf: 'center',
  },
  backLinkText: {
    color: '#6a0dad',
    fontWeight: '600',
    fontSize: 16,
  },
});
