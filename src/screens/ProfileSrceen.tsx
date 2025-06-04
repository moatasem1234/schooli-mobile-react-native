import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  I18nManager,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../store/authSlice';
import { useNavigation } from '@react-navigation/native';
import { useUpdateProfileMutation } from '../store/api/parentApi';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  console.log('User Data:', user);

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleSaveProfile = async () => {
    if (!editedUser.name || !editedUser.email) {
      Alert.alert('خطأ', 'الاسم والبريد الإلكتروني مطلوبان');
      return;
    }

    try {
      const response = await updateProfile({
        userId: userId,
        name: editedUser.name,
        email: editedUser.email,
        password: editedUser.password || undefined, // Only send password if provided
      }).unwrap();
      setEditModalVisible(false);
      console.log("userId" ,userId);
      console.log("editedUser",editedUser);
      console.log("response",response);
      
      Alert.alert('نجاح', response.message || 'تم تحديث الملف الشخصي بنجاح');
    } catch (error: any) {
      Alert.alert(
        'خطأ',
        error?.data?.message || 'فشل في تحديث الملف الشخصي',
      );
    }
  };

  const profileStats = [
    {
      title: 'الحصص المكتملة',
      value: '24',
      icon: 'check-circle',
      color: '#00C4B4',
    },
    { title: 'الحضور', value: '96%', icon: 'trending-up', color: '#4682B4' },
    { title: 'المستوى', value: 'الثاني', icon: 'school', color: '#FF6F61' },
    { title: 'النقاط', value: '1250', icon: 'star', color: '#FFD700' },
  ];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>لا يوجد بيانات مستخدم</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>الملف الشخصي</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={60} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.nameText}>{user.name || 'محمد أحمد'}</Text>
            <Text style={styles.emailText}>
              {user.email || 'mohamed@example.com'}
            </Text>
          </View>
        </View>

        {/* <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>معلومات الحساب</Text>

          <View style={styles.detailItem}>
            <Icon name="phone" size={24} color="#8E8E93" />
            <Text style={styles.detailText}>{user.phone || 'غير محدد'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="location-on" size={24} color="#8E8E93" />
            <Text style={styles.detailText}>{user.address || 'غير محدد'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="event" size={24} color="#8E8E93" />
            <Text style={styles.detailText}>
              تاريخ الانضمام:{' '}
              {new Date(user.created_at || Date.now()).toLocaleDateString(
                'ar-SA',
              )}
            </Text>
          </View>
        </View> */}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditModalVisible(true)}
        >
          <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
          <Icon name="edit" size={20} color="#00C4B4" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
          <Icon name="logout" size={20} color="red" />
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>تعديل الملف الشخصي</Text>

            <Text style={styles.labelTitle}>الاسم</Text>
            <TextInput
              style={styles.input}
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
              placeholder="الاسم"
              placeholderTextColor="#8E8E93"
            />
            <Text style={styles.labelTitle}>البريد الإلكتروني</Text>
            <TextInput
              style={styles.input}
              value={editedUser.email}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, email: text })
              }
              placeholder="البريد الإلكتروني"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
            />
            <Text style={styles.labelTitle}>كلمة المرور</Text>
            <TextInput
              style={styles.input}
              value={editedUser.password}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, password: text })
              }
              placeholder="كلمة المرور الجديدة"
              placeholderTextColor="#8E8E93"
              secureTextEntry={true} // Hide password input
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>حفظ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2526',
  },
  noUserText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
  profileContainer: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A3A3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
  },
  emailText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    marginTop: 5,
  },
  detailsSection: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    marginRight: 10,
    flex: 1,
  },
  editButton: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: '#00C4B4',
    borderRadius: 12,
    marginBottom: 15,
  },
  logoutButton: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 12,
    marginBottom: 15,
  },
  logoutButtonText: {
    fontSize: 16,
    color: 'red',
    fontFamily: 'Tajawal-Bold',
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  labelTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1A2526',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#00C4B4',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
  cancelButton: {
    backgroundColor: '#1A2526',
    borderWidth: 1,
    borderColor: '#8E8E93',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ProfileScreen;