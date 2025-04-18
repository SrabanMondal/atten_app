import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import DownloadCSV from '@/components/DownloadCSV';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
type StudentProp={
  Name: string,
  rollnumber: string,
  record?: string
}
type ApiStudentProp = Omit<StudentProp,'rollnumber'> & {Rollnumber:string}
type StudentData = {
item:StudentProp,
setatt: Dispatch<SetStateAction<StudentProp[]>>,
}
const AttendancePage = () => {
  const [att, setatt] = useState<Array<StudentProp>|any>(null)
    const [refresh, setrefresh] = useState(false)
    const [save, setsave] = useState("save")
    useEffect(() => {
      const fetchdata = async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                Toast.show({
                  text1: 'User not Authenticated',
                  type: 'error',
                })
                return;
              }
                const response = await fetch(API_URL+'/api/v1/admin/getallstudents',{
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `${token}`,
                    },
                  });
                  const res = await response.json();
                  
                  setatt(res.message?.map((student:ApiStudentProp):StudentProp => ({
                  Name: student.Name,
                  rollnumber: student.Rollnumber, 
                  record: 'Absent',
                })));
         
              } catch (error) {
                
              }
            }
            fetchdata();
          },[refresh])

  const fetchStudents = () => {
    setrefresh(prev=>!prev)
    Toast.show({
      text1: 'Data Fetched',
      type:'success',
    });
  };

  const toggleStatus = (roll:string) => {
    setatt((prev: Array<StudentProp>) =>
      prev.map((student) =>
        student.rollnumber === roll
    ? { ...student, record: student.record == 'Absent' ? 'Present' : 'Absent' }
    : {...student}
  )
);
  };
  const saveAttendance = async () => {

    try {
      setsave("load")
      const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                Toast.show({
                  text1: 'User not Authenticated',
                  type: 'error',
                })
                return;
              }
      const response = await fetch(API_URL+'/api/v1/admin/update',{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`,
    },
    
    body: JSON.stringify({
      data:att
    }),
    });
    setsave("done")
    Toast.show({
      text1: 'Attendance Saved',
      type:'success',
    });
  } catch (error) {
    Toast.show({
      type:'error',
      text1: 'Failed to save attendance',
    })
  }
  finally{
    console.log(att)
    setTimeout(() => {
                setsave("save");
              }, 1500);
            }
  };

  return (
    <ImageBackground
    source={require('@/assets/images/abg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Attendance</Text>

        {!att && (
          <TouchableOpacity style={styles.fetchButton} onPress={fetchStudents}>
            <Text style={styles.buttonText}>Fetch Student Data</Text>
          </TouchableOpacity>
        )}

        {att && (
          <FlatList
          contentContainerStyle={styles.listContent}
            data={att}
            keyExtractor={(item:StudentProp) => item.rollnumber}
            renderItem={({ item, index }) => (
              <View style={styles.studentCard}>
                <Text style={styles.studentText}>
                  {item.rollnumber} - {item.Name}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    item.record === 'Present' ? styles.present : styles.absent,
                  ]}
                  onPress={() => toggleStatus(item.rollnumber)}
                >
                  <Text style={styles.statustext}>{item.record}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {att && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={saveAttendance}>
            {save=="save"&&
            <Icon name="save" size={20} color="#fff" />}
            {save=="done" &&
              <Icon name="check" size={24} color="#fff" />
            }
            {
              save=="load" && <ActivityIndicator size="small" color="#fff"/>
            }
            </TouchableOpacity>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchStudents}>
          <Icon name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
           <DownloadCSV/>
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Cochin',
  },
  fetchButton: {
    backgroundColor: '#ff7eb3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  studentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statustext:{
    color: '#fff',
    fontSize: 10,
    fontWeight: 'semibold',
  },
  present: {
    backgroundColor: '#27AE60',
  },
  absent: {
    backgroundColor: '#f87171',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  refreshButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  downloadButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
    width:250,
  },
});

export default AttendancePage;
