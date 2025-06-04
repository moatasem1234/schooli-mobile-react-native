// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';

const HomeScreen = () => {

    const user = useSelector(selectUser);

  const quickStats = [
    { title: 'الحضور اليوم', value: '98%', icon: 'how-to-reg', color: '#00C4B4' },
    { title: 'الحصص المتبقية', value: '3', icon: 'schedule', color: '#4682B4' },
    { title: 'الإشعارات الجديدة', value: '2', icon: 'notifications', color: '#FF6F61' },
    { title: 'قريبا ', value: '1', icon: 'event', color: '#FFD700' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>أهلاً وسهلاً</Text>
        <Text style={styles.nameText}>{user?.name}</Text>
      </View>

      <View style={styles.statsContainer}>
        {quickStats.map((stat, index) => (
          <TouchableOpacity key={index} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color }]}>
              <Icon  name={stat.icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.upcomingSection}>
        <Text style={styles.sectionTitle}>الحصة اليوم</Text>
        <View style={styles.nextClassCard}>
          <View style={styles.nextClassInfo}>
            <View style={[styles.subjectIndicator, { backgroundColor: '#00C4B4' }]} />
            <View>
              <Text style={styles.subjectName}>رياضيات</Text>
              <Text style={styles.teacherName}>أ. محمد علي</Text>
              <Text style={styles.classTime}>9:00 - 9:45</Text>
            </View>
          </View>
          <View style={styles.timeRemaining}>
    
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2526',
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  nameText: {
    fontSize: 24,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
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
  upcomingSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 16,
  },
  nextClassCard: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextClassInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  subjectName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
  },
  teacherName: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  classTime: {
    fontSize: 14,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  timeRemaining: {
    alignItems: 'center',
  },
  timeRemainingText: {
    fontSize: 20,
    color: '#FFD700',
    fontFamily: 'Tajawal-Bold',
  },
  timeRemainingLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
  },
});

export default HomeScreen;