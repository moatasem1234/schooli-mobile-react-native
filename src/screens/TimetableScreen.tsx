
// src/screens/TimetableScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TimetableScreen = () => {
  const [selectedDay, setSelectedDay] = useState(0);

  const weekDays = [
    { date: '14', day: 'الأحد', isToday: false },
    { date: '15', day: 'الإثنين', isToday: true },
    { date: '16', day: 'الثلاثاء', isToday: false },
    { date: '17', day: 'الأربعاء', isToday: false },
    { date: '18', day: 'الخميس', isToday: false },
  ];

  const timetableData = {
    0: [ // Sunday
      { id: 1, time: '8:00 - 8:45', subject: 'اللغة العربية', teacher: 'أ. فاطمة أحمد', color: '#00C4B4' },
      { id: 2, time: '8:45 - 9:30', subject: 'رياضيات', teacher: 'أ. محمد علي', color: '#4682B4' },
      { id: 3, time: '9:30 - 10:15', subject: 'فيزياء', teacher: 'أ. أحمد محمود', color: '#FF6F61' },
      { id: 4, time: '10:30 - 11:15', subject: 'كيمياء', teacher: 'أ. سارة حسن', color: '#FFD700' },
      { id: 5, time: '11:15 - 12:00', subject: 'تاريخ', teacher: 'أ. عمر يوسف', color: '#800080' },
    ],
    1: [ // Monday
      { id: 1, time: '8:00 - 8:45', subject: 'رياضيات', teacher: 'أ. محمد علي', color: '#4682B4' },
      { id: 2, time: '8:45 - 9:30', subject: 'فيزياء', teacher: 'أ. أحمد محمود', color: '#FF6F61' },
      { id: 3, time: '9:30 - 10:15', subject: 'اللغة الإنجليزية', teacher: 'أ. مريم سالم', color: '#00C4B4' },
      { id: 4, time: '10:30 - 11:15', subject: 'أحياء', teacher: 'أ. ليلى أحمد', color: '#FFD700' },
      { id: 5, time: '11:15 - 12:00', subject: 'جغرافيا', teacher: 'أ. خالد محمد', color: '#800080' },
    ],
    2: [ // Tuesday
      { id: 1, time: '8:00 - 8:45', subject: 'كيمياء', teacher: 'أ. سارة حسن', color: '#FFD700' },
      { id: 2, time: '8:45 - 9:30', subject: 'اللغة العربية', teacher: 'أ. فاطمة أحمد', color: '#00C4B4' },
      { id: 3, time: '9:30 - 10:15', subject: 'رياضيات', teacher: 'أ. محمد علي', color: '#4682B4' },
      { id: 4, time: '10:30 - 11:15', subject: 'تربية إسلامية', teacher: 'أ. يوسف حسين', color: '#FF6F61' },
      { id: 5, time: '11:15 - 12:00', subject: 'تربية بدنية', teacher: 'أ. أسامة صالح', color: '#800080' },
    ],
    3: [ // Wednesday
      { id: 1, time: '8:00 - 8:45', subject: 'أحياء', teacher: 'أ. ليلى أحمد', color: '#FFD700' },
      { id: 2, time: '8:45 - 9:30', subject: 'تاريخ', teacher: 'أ. عمر يوسف', color: '#800080' },
      { id: 3, time: '9:30 - 10:15', subject: 'فيزياء', teacher: 'أ. أحمد محمود', color: '#FF6F61' },
      { id: 4, time: '10:30 - 11:15', subject: 'اللغة الإنجليزية', teacher: 'أ. مريم سالم', color: '#00C4B4' },
      { id: 5, time: '11:15 - 12:00', subject: 'رياضيات', teacher: 'أ. محمد علي', color: '#4682B4' },
    ],
    4: [ // Thursday
      { id: 1, time: '8:00 - 8:45', subject: 'جغرافيا', teacher: 'أ. خالد محمد', color: '#800080' },
      { id: 2, time: '8:45 - 9:30', subject: 'كيمياء', teacher: 'أ. سارة حسن', color: '#FFD700' },
      { id: 3, time: '9:30 - 10:15', subject: 'اللغة العربية', teacher: 'أ. فاطمة أحمد', color: '#00C4B4' },
      { id: 4, time: '10:30 - 11:15', subject: 'رياضيات', teacher: 'أ. محمد علي', color: '#4682B4' },
      { id: 5, time: '11:15 - 12:00', subject: 'تربية فنية', teacher: 'أ. نورا عبدالله', color: '#FF6F61' },
    ],
  };

  const renderDaySelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
      {weekDays.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayButton,
            selectedDay === index && styles.selectedDayButton,
            day.isToday && styles.todayButton,
          ]}
          onPress={() => setSelectedDay(index)}
        >
          <Text style={[
            styles.dayText,
            selectedDay === index && styles.selectedDayText,
            day.isToday && styles.todayText,
          ]}>
            {day.day}
          </Text>
          <Text style={[
            styles.dateText,
            selectedDay === index && styles.selectedDateText,
            day.isToday && styles.todayDateText,
          ]}>
            {day.date}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  //@ts-ignore
  const renderClassItem = ({ item }) => (
    <View style={styles.classCard}>
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <View style={styles.classInfo}>
        <Text style={styles.classTime}>{item.time}</Text>
        <Text style={styles.subjectName}>{item.subject}</Text>
        <Text style={styles.teacherName}>{item.teacher}</Text>
      </View>
      <Icon name="keyboard-arrow-left" size={24} color="#8E8E93" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>الجدول الدراسي</Text>
          <Icon name="school" size={24} color="#00C4B4" />
        </View>
        <Text style={styles.headerSubtitle}>أبريل 2025</Text>
      </View>

      {renderDaySelector()}

      <FlatList
      //@ts-ignore
        data={timetableData[selectedDay] || []}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.classList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2526',
  },
  header: {
    backgroundColor: '#1A2526',
    padding: 20,
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  daySelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayButton: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  selectedDayButton: {
    backgroundColor: '#00C4B4',
  },
  todayButton: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dayText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
  todayText: {
    color: '#FFD700',
  },
  dateText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Bold',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  todayDateText: {
    color: '#FFD700',
  },
  classList: {
    paddingHorizontal: 20,
  },
  classCard: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 16,
  },
  classInfo: {
    flex: 1,
  },
  classTime: {
    fontSize: 14,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
});

export default TimetableScreen;