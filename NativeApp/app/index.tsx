// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useRouter } from 'expo-router'; // Updated import for router
// import * as DocumentPicker from 'expo-document-picker';

// const QuizGeneratorScreen = () => {
//   const [topic, setTopic] = useState('');
//   const [quizType, setQuizType] = useState('mcqs');
//   const [numQuestions, setNumQuestions] = useState('');
//   const [document, setDocument] = useState<DocumentPicker.DocumentPickerResult | null>(null);

//   const router = useRouter(); // Initialize router

//   const handleDocumentPick = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*',
//         copyToCacheDirectory: false,
//       });

//       if (!result.canceled) {
//         // Check file size (10MB limit)
//         const asset = result.assets && result.assets[0];
//         if (asset && asset.size && asset.size <= 10 * 1024 * 1024) {
//           setDocument(result);
//         } else {
//           alert('File size exceeds 10MB limit');
//         }
//       }
//     } catch (err) {
//       console.error('Error picking document:', err);
//     }
//   };

//   const handleGenerateQuiz = () => {
//     // Here you would typically send the data to your backend
//     // For now, we'll just navigate to a dummy result screen
//     router.push('/quiz-result');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Quiz Generator</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Enter topic"
//         value={topic}
//         onChangeText={setTopic}
//       />

//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={quizType}
//           onValueChange={(itemValue) => setQuizType(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Multiple Choice" value="mcqs" />
//           <Picker.Item label="Fill in the Blanks" value="blanks" />
//           <Picker.Item label="True or False" value="truefalse" />
//           <Picker.Item label="Question and Answer" value="qanda" />
//         </Picker>
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Number of questions"
//         value={numQuestions}
//         onChangeText={setNumQuestions}
//         keyboardType="numeric"
//       />

//       <TouchableOpacity style={styles.button} onPress={handleDocumentPick}>
//         <Text style={styles.buttonText}>
//           {document && !document.canceled ? 'Document Selected' : 'Upload Document (Max 10MB)'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.generateButton} onPress={handleGenerateQuiz}>
//         <Text style={styles.buttonText}>Generate Quiz</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     backgroundColor: 'white',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//   },
//   pickerContainer: {
//     backgroundColor: 'white',
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   picker: {
//     height: 50,
//   },
//   button: {
//     backgroundColor: '#4a90e2',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   generateButton: {
//     backgroundColor: '#32cd32',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default QuizGeneratorScreen;
// app/index.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const GetStartedScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('./login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to QuizMaster</Text>
      <Text style={styles.subtitle}>Generate customized quizzes effortlessly</Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GetStartedScreen;
