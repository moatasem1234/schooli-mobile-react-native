import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';

const AttendanceScreen = () => {
  const screenWidth = Dimensions.get('window').width;

  const attendanceStats = {
    present: 95,
    absent: 5,
    totalDays: 100,
    presentDays: 95,
    absentDays: 5,
    percentage: 95,
  };

  const monthlyData = [
    { id: 1, month: 'سبتمبر', percentage: 92, date: 'أبريل 5, 2025' },
    { id: 2, month: 'أكتوبر', percentage: 98, date: 'أبريل 5, 2025' },
    { id: 3, month: 'نوفمبر', percentage: 89, date: 'أبريل 5, 2025' },
    { id: 4, month: 'ديسمبر', percentage: 94, date: 'أبريل 5, 2025' },
    { id: 5, month: 'يناير', percentage: 96, date: 'أبريل 5, 2025' },
    { id: 6, month: 'فبراير', percentage: 91, date: 'أبريل 5, 2025' },
    { id: 7, month: 'مارس', percentage: 97, date: 'أبريل 5, 2025' },
  ];

  //@ts-ignore
  const renderStatsCard = (title, value, color) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={[styles.statIndicator, { backgroundColor: color }]} />
    </View>
  );

  //@ts-ignore
  const renderMonthlyItem = ({ item }) => (
    <View style={styles.monthlyCard}>
      <View style={styles.monthlyInfo}>
        <Text style={styles.monthName}>{item.month}</Text>
        <Text style={styles.monthDate}>{item.date}</Text>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.percentageText}>{item.percentage}%</Text>
        <Progress.Bar
          progress={item.percentage / 100}
          width={120}
          height={8}
          color="#00C4B4"
          unfilledColor="#2A3A3B"
          borderWidth={0}
          borderRadius={4}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الحضور</Text>
        <Text style={styles.headerSubtitle}>إحصائيات الحضور الشهرية</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          {renderStatsCard('أيام الحضور', attendanceStats.presentDays, '#00C4B4')}
          {renderStatsCard('أيام الغياب', attendanceStats.absentDays, '#FF6F61')}
          {renderStatsCard('نسبة الحضور', `${attendanceStats.percentage}%`, '#FFD700')}
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>نظرة عامة على الحضور</Text>
        <View style={styles.progressWrapper}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>حاضر ({attendanceStats.present}%)</Text>
            <Progress.Bar
              progress={attendanceStats.present / 100}
              width={screenWidth * 0.8}
              height={12}
              color="#00C4B4"
              unfilledColor="#2A3A3B"
              borderWidth={0}
              borderRadius={6}
              style={styles.progressBar}
            />
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>غائب ({attendanceStats.absent}%)</Text>
            <Progress.Bar
              progress={attendanceStats.absent / 100}
              width={screenWidth * 0.8}
              height={12}
              color="#FF6F61"
              unfilledColor="#2A3A3B"
              borderWidth={0}
              borderRadius={6}
              style={styles.progressBar}
            />
          </View>
        </View>
      </View>

      <View style={styles.monthlySection}>
        <Text style={styles.sectionTitle}>الحضور الشهري</Text>
        <FlatList
          data={monthlyData}
          renderItem={renderMonthlyItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    position: 'relative',
  },
  statValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
  },
  statIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  chartContainer: {
    backgroundColor: '#2A3A3B',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  progressWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  progressItem: {
    width: '100%',
    marginVertical: 10,
  },
  progressLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    marginBottom: 8,
  },
  progressBar: {
    marginTop: 4,
  },
  monthlySection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 16,
  },
  monthlyCard: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthlyInfo: {
    flex: 1,
  },
  monthName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  monthDate: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  progressContainer: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 8,
  },
});

export default AttendanceScreen;