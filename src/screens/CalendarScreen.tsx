// src/screens/CalendarScreen.js
import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-04-18');

  const events = {
    '2025-04-15': [
      {
        id: 1,
        type: 'واجب',
        subject: 'رياضيات',
        time: '9:00 - 10:00',
        points: 25,
        color: '#FF6F61',
      },
    ],
    '2025-04-18': [
      {
        id: 2,
        type: 'واجب',
        subject: 'فيزياء',
        time: '9:00 - 10:00',
        points: 22,
        color: '#FF6F61',
      },
      {
        id: 3,
        type: 'واجب',
        subject: 'كيمياء',
        time: 'آخر موعد',
        points: 15,
        color: '#FFD700',
      },
    ],
    '2025-04-20': [
      {
        id: 4,
        type: 'مشروع',
        subject: 'أحياء',
        time: 'تسليم',
        points: 30,
        color: '#00C4B4',
      },
    ],
    '2025-04-22': [
      {
        id: 5,
        type: 'اختبار',
        subject: 'اللغة العربية',
        time: '8:00 - 9:30',
        points: 35,
        color: '#FF6F61',
      },
    ],
    '2025-04-25': [
      {
        id: 6,
        type: 'عرض',
        subject: 'التاريخ',
        time: '10:00 - 11:00',
        points: 20,
        color: '#4682B4',
      },
    ],
  };

  const markedDates = {};
  Object.keys(events).forEach(date => {
    //@ts-ignore
    markedDates[date] = {
      marked: true,
      dotColor: '#00C4B4',
      selected: date === selectedDate,
      selectedColor: date === selectedDate ? '#00C4B4' : undefined,
    };
  });

  //@ts-ignore
  const renderEventItem = ({item}) => (
    <View style={styles.eventCard}>
      <View style={[styles.eventIndicator, {backgroundColor: item.color}]} />
      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          {/* <Text style={styles.eventPoints}>{item.points} نقطة</Text> */}
        </View>
          <Text style={styles.eventType}>{item.type}</Text>

        <Text style={styles.eventSubject}>{item.subject}</Text>
        <View style={styles.eventTimeContainer}>
          <Icon name="access-time" size={16} color="#8E8E93" />
          <Text style={styles.eventTime}>{item.time}</Text>
        </View>
      </View>
    </View>
  );
  
    //@ts-ignore
  const selectedEvents = events[selectedDate] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التقويم</Text>
        <Text style={styles.headerSubtitle}>الأحداث والمواعيد المهمة</Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          current={'2025-04-18'}
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#2A3A3B',
            calendarBackground: '#2A3A3B',
            textSectionTitleColor: '#FFFFFF',
            dayTextColor: '#FFFFFF',
            todayTextColor: '#00C4B4',
            selectedDayTextColor: '#FFFFFF',
            monthTextColor: '#FFFFFF',
            selectedDayBackgroundColor: '#00C4B4',
            arrowColor: '#00C4B4',
            textDisabledColor: '#8E8E93',
            textDayFontFamily: 'Tajawal-Regular',
            textMonthFontFamily: 'Tajawal-Bold',
            textDayHeaderFontFamily: 'Tajawal-Regular',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
        />
      </View>

      <View style={styles.eventsSection}>
        <View style={styles.eventsSectionHeader}>
          <Text style={styles.eventsTitle}>أحداث اليوم</Text>
          <Text style={styles.selectedDateText}>
            {new Date(selectedDate).toLocaleDateString('ar-SA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {selectedEvents.length > 0 ? (
          <FlatList
            data={selectedEvents}
            renderItem={renderEventItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noEventsContainer}>
            <Icon name="event-busy" size={48} color="#8E8E93" />
            <Text style={styles.noEventsText}>لا توجد أحداث في هذا اليوم</Text>
          </View>
        )}
      </View>
    </View>
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
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 12,
  },
  eventsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventsSectionHeader: {
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  eventCard: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
  },
  eventPoints: {
    fontSize: 12,
    color: '#FFD700',
    fontFamily: 'Tajawal-Regular',
  },
  eventSubject: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  eventTime: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    marginRight: 4,
    textAlign: 'right',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noEventsText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default CalendarScreen;
