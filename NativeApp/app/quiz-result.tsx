import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

const QuizResultScreen = () => {
  // This is dummy data. In a real app, you'd fetch this from your backend
  const quizData = `
1. What is the capital of France?
   a) London
   b) Berlin
   c) Paris
   d) Madrid

2. Who painted the Mona Lisa?
   a) Vincent van Gogh
   b) Leonardo da Vinci
   c) Pablo Picasso
   d) Michelangelo

3. What is the largest planet in our solar system?
   a) Earth
   b) Mars
   c) Jupiter
   d) Saturn
  `;

  const handleCopyToClipboard = () => {
    Clipboard.setStringAsync(quizData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generated Quiz</Text>
      <View style={styles.quizContainer}>
        <Text style={styles.quizText}>{quizData}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCopyToClipboard}>
        <Text style={styles.buttonText}>Copy Quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Generate Another Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  quizContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
  quizText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QuizResultScreen;