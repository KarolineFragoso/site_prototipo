import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import ProductRegistrationScreen from './ProductRegistrationScreen';
import EditProductsScreen from './EditProductsScreen';
import SalesScreen from './SalesScreen';
import SalesReportScreen from './SalesReportScreen';

// Login Screen component
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const PASSWORD = 'admin123';

  const handleLogin = () => {
    if (password === PASSWORD) {
      onLogin();
      setPassword('');
    } else {
      Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

// Main Screen component
function MainScreen({ onNavigate, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joãozinho Celular</Text>
      <TouchableOpacity style={styles.navLink} onPress={() => onNavigate('ProductRegistration')}>
        <Text style={styles.navLinkText}>Cadastro de Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navLink} onPress={() => onNavigate('Sales')}>
        <Text style={styles.navLinkText}>Fazer Vendas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navLink} onPress={() => onNavigate('EditProducts')}>
        <Text style={styles.navLinkText}>Editar Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navLink} onPress={() => onNavigate('SalesReport')}>
        <Text style={styles.navLinkText}>Relatório de Vendas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutBtnText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Login');

  const handleLogin = () => {
    setLoggedIn(true);
    setCurrentScreen('Main');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentScreen('Login');
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  switch (currentScreen) {
    case 'Main':
      return <MainScreen onNavigate={navigateTo} onLogout={handleLogout} />;
    case 'ProductRegistration':
      return <ProductRegistrationScreen onBack={() => navigateTo('Main')} />;
    case 'EditProducts':
      return <EditProductsScreen onBack={() => navigateTo('Main')} />;
    case 'Sales':
      return <SalesScreen onBack={() => navigateTo('Main')} />;
    case 'SalesReport':
      return <SalesReportScreen onBack={() => navigateTo('Main')} />;
    default:
      return <MainScreen onNavigate={navigateTo} onLogout={handleLogout} />;
  }
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
  navLink: {
    backgroundColor: '#121212',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  navLinkText: {
    color: '#dcdcdc',
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
