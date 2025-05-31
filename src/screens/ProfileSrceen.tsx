// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {selectUser} from '../store/authSlice';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const ProfileScreen = () => {
  const user = useSelector(selectUser);

  const profileStats = [
    {
      title: 'الحصص المكتملة',
      value: '24',
      icon: 'check-circle',
      color: '#00C4B4',
    },
    {title: 'الحضور', value: '96%', icon: 'trending-up', color: '#4682B4'},
    {title: 'المستوى', value: 'الثاني', icon: 'school', color: '#FF6F61'},
    {title: 'النقاط', value: '1250', icon: 'star', color: '#FFD700'},
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

        <View style={styles.detailsSection}>
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
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
          <Icon name="edit" size={20} color="#00C4B4" />
        </TouchableOpacity>
      </View>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
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
    borderWidth: 1,
    borderColor: '#00C4B4',
    borderRadius: 12,
    marginBottom: 30,
  },
  editButtonText: {
    fontSize: 16,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
    marginRight: 10,
  },
});

export default ProfileScreen;
