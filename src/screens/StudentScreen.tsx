import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from '../store/api/studentApi';
import { hasPermission } from '../store/authSlice';
import { StudentPayload } from '../types/student';
import { RootState } from '../store/store';

const StudentScreen: React.FC = () => {
  const state = useSelector((state: RootState) => state);
  const canViewStudents = hasPermission(state, 'view-students');

  // RTK Query hooks
  const { data: studentsResponse, isLoading, error } = useGetStudentsQuery();
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  // Form state
  const [formData, setFormData] = useState<StudentPayload>({
    name: '',
    gender: '',
    birth_date: '',
    parent_id: 0,
    classroom_id: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Debug log in useEffect to avoid render loop
  useEffect(() => {
    console.log('Students Response:', studentsResponse);
  }, [studentsResponse]);

  // Handle form input changes
  const handleInputChange = (name: keyof StudentPayload, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'parent_id' || name === 'classroom_id' ? Number(value) : value,
    }));
  };

  // Handle form submission for create/update
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateStudent({ id: editingId, data: formData }).unwrap();
        setEditingId(null);
      } else {
        await createStudent(formData).unwrap();
      }
      setFormData({ name: '', gender: '', birth_date: '', parent_id: 0, classroom_id: 0 });
      Alert.alert('نجاح', editingId ? 'تم تحديث الطالب بنجاح' : 'تم إنشاء الطالب بنجاح');
    } catch (err: any) {
      Alert.alert('خطأ', err?.data?.message || 'حدث خطأ');
      console.error('Error:', err);
    }
  };

  // Handle edit button click
  const handleEdit = (student: StudentPayload & { id: number }) => {
    setFormData({
      name: student.name,
      gender: student.gender,
      birth_date: student.birth_date,
      parent_id: student.parent_id,
      classroom_id: student.classroom_id,
    });
    setEditingId(student.id);
  };

  // Handle delete button click
  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id).unwrap();
      Alert.alert('نجاح', 'تم حذف الطالب بنجاح');
    } catch (err: any) {
      Alert.alert('خطأ', err?.data?.message || 'خطأ في حذف الطالب');
      console.error('Error deleting student:', err);
    }
  };

  if (!canViewStudents) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إدارة الطلاب</Text>
        </View>
        <Text style={styles.errorText}>ليس لديك إذن لعرض الطلاب</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>إدارة الطلاب</Text>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#00C4B4" />}
      {error && (
        <Text style={styles.errorText}>خطأ: {JSON.stringify(error)}</Text>
      )}

      {/* Form for creating/updating students */}
      <View style={styles.form}>
        <Text style={styles.label}>الاسم</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          placeholder="أدخل اسم الطالب"
          autoCapitalize="words"
        />

        <Text style={styles.label}>الجنس</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            mode="dropdown" 
            dropdownIconColor={'#8E8E93'}
            selectionColor={'#00C4B4'}
            itemStyle={{ color: '#8E8E93',  fontFamily: 'Tajawal-Regular' }}
            collapsable={false}
            selectedValue={formData.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            <Picker.Item label="اختر الجنس" value="" />
            <Picker.Item label="ذكر" value="male" />
            <Picker.Item label="أنثى" value="female" />
          </Picker>
        </View>

        <Text style={styles.label}>تاريخ الميلاد</Text>
        <TextInput
          style={styles.input}
          value={formData.birth_date}
          onChangeText={(value) => handleInputChange('birth_date', value)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#8E8E93"
        />

        <Text style={styles.label}>معرف ولي الأمر</Text>
        <TextInput
          style={styles.input}
          value={formData.parent_id ? formData.parent_id.toString() : ''}
          onChangeText={(value) => handleInputChange('parent_id', value)}
          keyboardType="numeric"
          placeholder="أدخل معرف ولي الأمر"
          placeholderTextColor="#8E8E93"
        />

        <Text style={styles.label}>معرف الصف</Text>
        <TextInput
          style={styles.input}
          value={formData.classroom_id ? formData.classroom_id.toString() : ''}
          onChangeText={(value) => handleInputChange('classroom_id', value)}
          keyboardType="numeric"
          placeholder="أدخل معرف الصف"
          placeholderTextColor="#8E8E93"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editingId ? 'تحديث الطالب' : 'إضافة طالب'}</Text>
          <Icon name={editingId ? "save" : "add"} size={20} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>

      {/* List of students */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>قائمة الطلاب</Text>
        {studentsResponse?.data.map((student) => (
          <View key={student.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentInfo}>
                <Text style={styles.infoLabel}>الجنس: </Text>
                {student.gender === 'male' ? 'ذكر' : 'أنثى'}
              </Text>
              <Text style={styles.studentInfo}>
                <Text style={styles.infoLabel}>الصف: </Text>
                {student.classroom.name}
              </Text>
              <Text style={styles.studentInfo}>
                <Text style={styles.infoLabel}>ولي الأمر: </Text>
                {student.parent.user.name}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(student)}
              >
                <Icon name="edit" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(student.id)}
              >
                <Icon name="delete" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Memoize the component to prevent unnecessary re-renders
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2526',
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
  form: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A2526',
    borderWidth: 1,
    borderColor: '#2A3A3B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
  },
  pickerContainer: {
    backgroundColor: '#1A2526',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
  },
  button: {
    backgroundColor: '#00C4B4',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 8,
  },
  studentInfo: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 4,
  },
  infoLabel: {
    color: '#00C4B4',
  },
  cardActions: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#FFD700',
  },
  deleteButton: {
    backgroundColor: '#FF6F61',
  },
  errorText: {
    color: '#FF6F61',
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
    margin: 20,
  },
});
export default React.memo(StudentScreen);
