// app/login.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Placeholder for authentication logic
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    // Navigate to Generate Quiz screen
    router.push('./generate_quiz');
  };

  const navigateToSignUp = () => {
    router.push('./signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to QuizMaster</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToSignUp}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#32cd32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    color: '#4a90e2',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
