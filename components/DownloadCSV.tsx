import React from 'react';
import { Pressable, Platform, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { API_URL } from '@env';
import * as FileSystem from 'expo-file-system'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';
import axios from 'axios';
const DownloadCSV = () => {
  const downloadCSV = async () => {
    try {
      console.log(API_URL)
      const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                console.log('Token not found in AsyncStorage');
                return;
              }
      const response = await fetch(`${API_URL}/api/v1/admin/getcsv`,{
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });
      const csvData = await response.text();
      console.log(csvData);
      console.log('Content-Type:', response.headers.get('Content-Type'));

      const fileName = `${FileSystem.documentDirectory}data.csv`;
      await FileSystem.writeAsStringAsync(fileName, csvData);

      if (Platform.OS === 'android') {
        // Requesting directory access through StorageAccessFramework for Android
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted) {
          const uri = await FileSystem.StorageAccessFramework.createFileAsync(
            permission.directoryUri,
            'data.csv',
            'text/csv'
          );
          await FileSystem.writeAsStringAsync(uri, csvData);
        }
      }

      console.log('CSV downloaded and saved to:', fileName);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <Pressable onPress={downloadCSV} style={styles.button}>
      <Icon name="download" size={25} color="#fff" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1,
    shadowRadius: 4, 
  },
});

export default DownloadCSV;
