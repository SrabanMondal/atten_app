import React,  { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { API_URL } from '@env';
import Toast from 'react-native-toast-message';
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false)
  const [refresh, setrefresh] = useState(false)
  useEffect(() => {
    const fetchtoken = async ()=>{
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      setLogin(true);
    }  else {
      setLogin(false);
    }}
    fetchtoken();
  }, [refresh])
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL+"/api/v1/admin/login", {
        email,
        password,
      });

      const { message } = response.data;
      await AsyncStorage.setItem("userToken", message);
      if (message){
        setLogin(true);
      }
      Toast.show({
        type: 'success',
        text1: 'Login Success!',
        text2: 'Welcome to Attendance App',
      });
    } catch (error) {
      const err = error as AxiosError
      Toast.show({
        type: 'error',
        text1: "Login Fail",
        text2: "Credentials Invalid",
      });
    } finally {
      setLoading(false);
    }
  };
  const logout = async ()=>{
    await AsyncStorage.removeItem("userToken");
    setLogin(false);
    setrefresh(prev=>!prev);
    Toast.show({
      type:'success',
      text1: 'Logout Success!',
      text2: 'See you soon!',
    });
  }
  return (
    <ImageBackground
    source={require('@/assets/images/lbg.webp')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Your Credentials</Text>
        {
          login? (
            <Text style={styles.successtext}>Logged in successfully!</Text>
          ) : null
        }
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#dcdcdc"
          value={email}
          onChangeText={(text)=>setEmail(text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#dcdcdc"
          secureTextEntry
          value={password}
          onChangeText={(text)=>setPassword(text)}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>
        {
          login && (
            <TouchableOpacity style={styles.logoutbutton} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          )
        }
        <Toast/>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 10,
    resizeMode: 'cover',
    width: '100%',       
    height: '100%',      
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    fontFamily: 'Cochin', 
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#43434380',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#dcdcdc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  button: {
    backgroundColor: '#ff7eb3',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  logoutbutton: {
    marginTop: 20,
    backgroundColor: '#f87171',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  successtext:{
    color: '#00ff00',
    fontSize: 18,
    fontWeight: 'semibold',
    textAlign: 'left', 
    marginBottom:20,
  }
});
