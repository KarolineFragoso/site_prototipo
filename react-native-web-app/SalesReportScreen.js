import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Alert } from 'react-native';

export default function SalesReportScreen({ onBack }) {
  const [sales, setSales] = useState([]);
  const API_URL = 'https://joaozinho-celular.onrender.com';

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch(`${API_URL}/sales`);
      if (!response.ok) throw new Error('Erro ao buscar vendas');
      const data = await response.json();
      setSales(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatório de Vendas</Text>
      {sales.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma venda registrada.</Text>
      ) : (
        sales.map((sale) => (
          <View key={sale.id} style={styles.saleItem}>
            <Text style={styles.productText}>Produto: {sale.product}</Text>
            <Text style={styles.productText}>Quantidade: {sale.quantity}</Text>
            <Text style={styles.productText}>Preço Total: R$ {parseFloat(sale.total_price).toFixed(2)}</Text>
            <Text style={styles.productText}>Data: {sale.date}</Text>
            <Text style={styles.productText}>Hora: {sale.time}</Text>
          </View>
        ))
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
  saleItem: {
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
