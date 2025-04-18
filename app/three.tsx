import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
type StudentProp = {
    Name: string;
    Rollnumber: string;
  };
const StudentPage = () => {
  const [students, setStudents] = useState<Array<StudentProp>|any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [refresh, setrefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                Toast.show({
                      text1: 'User not Authenticated',
                                  type: 'error',
                                })
                return;
              }
              console.log(token);
        const response = await fetch(API_URL+'/api/v1/admin/getallstudents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });
        const student = await response.json();
        setStudents(student.message);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Failed to fetch students",
        })
      }
    };
    fetchData();
  }, [refresh]);

  const addStudent = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                Toast.show({
                  type: 'error',
                    text1: 'User not Authenticated',
                  })
                return;
              }
      const data = await fetch(API_URL+'/api/v1/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          name: name,
          rollnumber: rollNumber,
        }),
      });
      //setModalVisible(false);
      Toast.show({
        type: "success",
        text1: "Student Added",
        text2: `Added Student with Name ${name} and Roll Number ${rollNumber}`,
      })
    } catch (error:any) {
      Toast.show({
        type: "error",
        text1: "Failed to add student",
      })
    }
    finally{
        setModalVisible(false);
        setrefresh((prev) => !prev);
    }
  };

  // Delete student
  const deleteStudent = async (rollNumber:string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                Toast.show({
                    text1: 'User not Authenticated',
                   type: 'error',
                  })
                return;
              }
              console.log(token);
      const data = await fetch(API_URL+'/api/v1/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          rollnumber: rollNumber,
        }),
      });
      Toast.show({type:"success",text1:`Student Deleted`, text2: `Deleted Student with Roll Number ${rollNumber}`})
    } catch (error) {
      Toast.show({type:"error",text1:"Failed to delete student"})
    } finally{
      setrefresh(prev=>!prev);
    }
  };

  return (
    <ImageBackground
    source={require('@/assets/images/dbg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Student List</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>

        {/* Student List */}
        <FlatList
          data={students}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item:StudentProp) => item.Rollnumber}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <Text style={styles.studentText}>
                {item.Rollnumber} - {item.Name}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteStudent(item.Rollnumber)}
              >
               <Icon name="trash" size={20} color="#ffffff" /> 
              </TouchableOpacity>
            </View>
          )}
          style={{ marginTop: 20 }}
        />

        {/* Modal for Adding Student */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Student</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Student Name"
                placeholderTextColor="#43434390"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Roll Number"
                placeholderTextColor="#43434390"
                value={rollNumber}
                onChangeText={(text) => setRollNumber(text)}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={addStudent}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Toast/>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    flex:1,
  },
  listContent: {
    padding: 10,
    width: 250,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Cochin',
  },
  addButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:5,
    flex:1,
  },
  studentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#43434340',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#333',
    fontSize: 16,
    
  },
  submitButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
});

export default StudentPage;
