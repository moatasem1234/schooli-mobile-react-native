
// src/screens/NotificationsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      date: 'أبريل 9, 2025',
      time: '7:45',
      title: 'إلغاء الحصة',
      message: 'تم إلغاء الحصة الأولى لمادة الرياضيات',
      read: false,
      type: 'class',
      icon: 'cancel',
      color: '#FF6F61',
    },
    {
      id: 2,
      date: 'أبريل 8, 2025',
      time: '15:30',
      title: 'اختبار قادم',
      message: 'اختبار مادة الفيزياء يوم الأحد الساعة 9:00 صباحاً',
      read: false,
      type: 'exam',
      icon: 'quiz',
      color: '#FFD700',
    },
    {
      id: 3,
      date: 'أبريل 7, 2025',
      time: '12:00',
      title: 'تحديث الجدول',
      message: 'تم تحديث الجدول الدراسي للأسبوع القادم',
      read: true,
      type: 'schedule',
      icon: 'schedule',
      color: '#00C4B4',
    },
    {
      id: 4,
      date: 'أبريل 6, 2025',
      time: '14:20',
      title: 'واجب منزلي',
      message: 'تم إضافة واجب جديد لمادة الكيمياء - آخر موعد للتسليم غداً',
      read: true,
      type: 'homework',
      icon: 'assignment',
      color: '#4682B4',
    },
    {
      id: 5,
      date: 'أبريل 5, 2025',
      time: '10:15',
      title: 'درجات الاختبار',
      message: 'تم رفع درجات اختبار اللغة العربية - النتيجة: 95/100',
      read: true,
      type: 'grade',
      icon: 'grade',
      color: '#800080',
    },
    {
      id: 6,
      date: 'أبريل 4, 2025',
      time: '16:45',
      title: 'فعالية مدرسية',
      message: 'دعوة لحضور المعرض العلمي يوم الخميس في قاعة المؤتمرات',
      read: true,
      type: 'event',
      icon: 'event',
      color: '#FF6F61',
    },
    {
      id: 7,
      date: 'أبريل 3, 2025',
      time: '9:30',
      title: 'تغيير القاعة',
      message: 'تم تغيير قاعة حصة الأحياء من A101 إلى B205',
      read: true,
      type: 'room',
      icon: 'room',
      color: '#FFD700',
    },
    {
      id: 8,
      date: 'أبريل 2, 2025',
      time: '13:15',
      title: 'رسالة من المعلم',
      message: 'أ. محمد علي: يرجى مراجعة الفصل الثالث قبل الاختبار',
      read: true,
      type: 'message',
      icon: 'message',
      color: '#00C4B4',
    },
  ]);

  // @ts-ignore
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // @ts-ignore
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationMeta}>
          <Text style={styles.notificationTime}>{item.time}</Text>
          <Text style={styles.notificationDate}>{item.date}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Icon name={item.icon} size={20} color="#FFFFFF" />
        </View>
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
          {item.title}
        </Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>الإشعارات</Text>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
              <Text style={styles.markAllText}>قراءة الكل</Text>
            </TouchableOpacity>
          )}
        </View>
        {unreadCount > 0 && (
          <Text style={styles.unreadCountText}>
            لديك {unreadCount} إشعار غير مقروء
          </Text>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.notificationsList}
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
  markAllButton: {
    backgroundColor: '#00C4B4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  markAllText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
  },
  unreadCountText: {
    fontSize: 14,
    color: '#FFD700',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  notificationsList: {
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#2A3A3B',
    borderLeftWidth: 4,
    borderLeftColor: '#00C4B4',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationMeta: {
    alignItems: 'flex-end',
  },
  notificationDate: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  notificationTime: {
    fontSize: 14,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    alignItems: 'flex-end',
  },
  notificationTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#00C4B4',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C4B4',
  },
});

export default NotificationsScreen;