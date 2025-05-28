import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ProductRegistrationScreen from './ProductRegistrationScreen';
import EditProductsScreen from './EditProductsScreen';
import SalesScreen from './SalesScreen';
import SalesReportScreen from './SalesReportScreen';

// não consegui pensar em uma segurança melhor me perdoa Deus T_T

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const PASSWORD = 'admin123';

  const handleLogin = () => {
    if (password === PASSWORD) {
      setError('');
      onLogin();
      setPassword('');
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Login</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={styles.errorText}>{' '}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Digite a senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main Screen component
function MainScreen({ onNavigate, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joãozinho Celular</Text>
      <TouchableOpacity
        style={styles.navLink}
        onPress={() => onNavigate('ProductRegistration')}
      >
        <Text style={styles.navLinkText}>Cadastro de Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navLink}
        onPress={() => onNavigate('Sales')}
      >
        <Text style={styles.navLinkText}>Fazer Vendas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navLink}
        onPress={() => onNavigate('EditProducts')}
      >
        <Text style={styles.navLinkText}>Editar Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navLink}
        onPress={() => onNavigate('SalesReport')}
      >
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
  // Login styles
  loginContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginBox: {
    backgroundColor: '#121212',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6a0dad',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#6a0dad',
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#6a0dad',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
  errorText: {
    height: 20,
    color: '#dc3545',
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'center',
  },

  // Main screen styles
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    justifyContent: 'center',
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
