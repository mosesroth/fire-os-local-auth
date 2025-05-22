import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricTypes, setBiometricTypes] = useState([]);
  const [enrolledLevel, setEnrolledLevel] = useState(0);
  const [authResult, setAuthResult] = useState(null);
  const [logs, setLogs] = useState([]);

  // Add log function to track operations
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs]);
  };

  // Check if hardware supports biometrics
  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      addLog(`Biometric hardware support: ${compatible ? 'Yes' : 'No'}`);
      
      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricTypes(types);
        
        const typeNames = types.map(type => {
          switch (type) {
            case LocalAuthentication.AuthenticationType.FINGERPRINT:
              return 'Fingerprint';
            case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
              return 'Face ID';
            case LocalAuthentication.AuthenticationType.IRIS:
              return 'Iris';
            default:
              return `Type ${type}`;
          }
        });
        
        addLog(`Supported authentication types: ${typeNames.join(', ')}`);
      }
    } catch (error) {
      addLog(`Error checking biometric support: ${error.message}`);
    }
  };

  // Check if biometrics are enrolled
  const checkBiometricEnrollment = async () => {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setEnrolledLevel(enrolled ? 1 : 0);
      addLog(`Biometrics enrolled: ${enrolled ? 'Yes' : 'No'}`);
    } catch (error) {
      addLog(`Error checking enrollment: ${error.message}`);
    }
  };

  // Authenticate with biometrics
  const authenticate = async () => {
    try {
      // Check if hardware is available
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        addLog('Biometric hardware not available');
        Alert.alert('Error', 'Biometric hardware not available');
        return;
      }

      // Check if biometrics are enrolled
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        addLog('No biometrics enrolled');
        Alert.alert('Error', 'No biometrics enrolled');
        return;
      }

      // Authenticate
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      setAuthResult(result);
      addLog(`Authentication ${result.success ? 'succeeded' : 'failed'}: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`Authentication error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Cancel authentication if in progress
  const cancelAuthentication = async () => {
    try {
      await LocalAuthentication.cancelAuthenticate();
      addLog('Authentication cancelled');
    } catch (error) {
      addLog(`Error cancelling authentication: ${error.message}`);
    }
  };

  // Run initial checks when component mounts
  useEffect(() => {
    checkBiometricSupport();
    checkBiometricEnrollment();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Local Authentication Test</Text>
      <Text style={styles.subtitle}>Fire OS Compatibility Test</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Biometric Hardware Support: {isBiometricSupported ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.infoText}>
          Biometrics Enrolled: {enrolledLevel === 1 ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.infoText}>
          Supported Types: {biometricTypes.length > 0 
            ? biometricTypes.map(type => `Type ${type}`).join(', ') 
            : 'None'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Check Biometric Support" 
          onPress={checkBiometricSupport} 
        />
        <Button 
          title="Check Enrollment" 
          onPress={checkBiometricEnrollment} 
        />
        <Button 
          title="Authenticate" 
          onPress={authenticate} 
        />
        <Button 
          title="Cancel Authentication" 
          onPress={cancelAuthentication} 
        />
      </View>

      {authResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Authentication Result:</Text>
          <Text style={styles.resultText}>
            Success: {authResult.success ? 'Yes' : 'No'}
          </Text>
          {authResult.error && (
            <Text style={styles.resultText}>
              Error: {authResult.error}
            </Text>
          )}
        </View>
      )}

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Logs:</Text>
        <ScrollView style={styles.logScroll}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  resultContainer: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logScroll: {
    flex: 1,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});
