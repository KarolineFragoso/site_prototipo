import API_URL from './config';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';

export default function SalesReportScreen({ onBack }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => {
    if (!filterDate) return true;
    const saleDate = new Date(sale.date).toISOString().slice(0, 10);
    return saleDate.includes(filterDate);
  });

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell]}>ID</Text>
      <Text style={[styles.cell, styles.headerCell]}>Produto</Text>
      <Text style={[styles.cell, styles.headerCell]}>Qtd</Text>
      <Text style={[styles.cell, styles.headerCell]}>Total (R$)</Text>
      <Text style={[styles.cell, styles.headerCell]}>Tipo</Text>
      <Text style={[styles.cell, styles.headerCell]}>Data</Text>
      <Text style={[styles.cell, styles.headerCell]}>Hora</Text>
    </View>
  );

  const renderRow = (sale) => {
    let total = parseFloat(sale.total_price);
    if (isNaN(total)) total = 0;

// horario da china eu acho

    const date = new Date(sale.date || '');
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();

    return (
      <View key={sale.id} style={styles.row}>
        <Text style={styles.cell}>{sale.id}</Text>
        <Text style={styles.cell}>{sale.product}</Text>
        <Text style={styles.cell}>{sale.quantity}</Text>
        <Text style={styles.cell}>{total.toFixed(2)}</Text>
        <Text style={styles.cell}>{sale.price_type === 'wholesale' ? 'Atacado' : 'Varejo'}</Text>
        <Text style={styles.cell}>{dateStr}</Text>
        <Text style={styles.cell}>{timeStr}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatório de Vendas</Text>

      <TextInput
        style={styles.input}
        placeholder="Filtrar por data (YYYY-MM-DD)"
        value={filterDate}
        onChangeText={setFilterDate}
      />

      <View style={styles.table}>
        {loading ? (
          <ActivityIndicator size="large" color="#6a0dad" />
        ) : filteredSales.length === 0 ? (
          <Text style={styles.emptyMessage}>Nenhuma venda registrada.</Text>
        ) : (
          <>
            {renderHeader()}
            {filteredSales.map(renderRow)}
          </>
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Voltar para o início</Text>
      </TouchableOpacity>
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
    letterSpacing: 1,
  },
  table: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#6a0dad',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#1e1e1e',
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#6a0dad',
    borderRadius: 6,
  },
  cell: {
    flex: 1,
    color: '#dcdcdc',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  headerCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  emptyMessage: {
    color: '#9a7ed1',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#6a0dad',
    fontWeight: '600',
    fontSize: 16,
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
});
