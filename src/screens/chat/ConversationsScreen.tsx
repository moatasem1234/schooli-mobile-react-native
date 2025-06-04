// src/screens/ConversationsScreen.tsx
import React, { use, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useGetConversationsQuery} from '../../store/api/chatApi';
import {Conversation} from '../../types/chat';

const ConversationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {data, isLoading, error , refetch} = useGetConversationsQuery();
  useEffect(()=>{
    refetch()
  },[navigation]);


  const renderConversation = ({item}: {item: Conversation}) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() =>
        //@ts-ignore
        navigation.navigate('ChatScreen', {
          conversationId: item.id,
          participantName: item.participant.name,
        })
      }>
      {item.unread_count > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread_count}</Text>
        </View>
      )}
      <View style={styles.conversationContent}>
        <Text style={styles.participantName}>{item.participant.name}</Text>
        {item.last_message && (
          <Text style={styles.lastMessage}>
            {item.last_message.content.length > 30
              ? `${item.last_message.content.substring(0, 30)}...`
              : item.last_message.content}
          </Text>
        )}
      </View>
      {item.last_message && (
        <Text style={styles.lastMessageTime}>
          {new Date(item.last_message.created_at).toLocaleTimeString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#00C4B4" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert('خطأ', 'فشل في تحميل المحادثات');
    return <Text style={styles.errorText}>خطأ: {JSON.stringify(error)}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>المحادثات</Text>
      </View>
      <FlatList
        data={data?.data || []}
        renderItem={renderConversation}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>لا توجد محادثات حاليًا</Text>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        //@ts-ignore
        onPress={() => navigation.navigate('StartConversationScreen')}>
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
  conversationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  conversationContent: {
    flex: 1,
  },
  participantName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
  },
  unreadBadge: {
    backgroundColor: '#FF6F61',
    borderRadius: 12,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 11,
    top: 11,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Tajawal-Bold',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Tajawal-Regular',
  },
  errorText: {
    color: '#FF6F61',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Tajawal-Regular',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00C4B4',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ConversationsScreen;
