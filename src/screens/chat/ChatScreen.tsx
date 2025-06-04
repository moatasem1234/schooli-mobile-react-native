// src/screens/ChatScreen.tsx
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} from '../../store//api/chatApi';
import {Message} from '../../types/chat';
import {selectUser} from '../../store/authSlice';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const ChatScreen: React.FC<{route: any}> = ({route}) => {
  const {conversationId, participantName} = route.params;
  const [messageContent, setMessageContent] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const user = useSelector(selectUser);

  const {data, isLoading, error, refetch} = useGetMessagesQuery({
    conversationId,
  });
  const [sendMessage, {isLoading: isSending}] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const navigation = useNavigation();
  useEffect(() => {
    // Mark messages as read when the screen loads
    markAsRead({conversationId});
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رسالة');
      return;
    }

    try {
      await sendMessage({conversationId, content: messageContent}).unwrap();
      setMessageContent('');
      refetch();
      flatListRef.current?.scrollToOffset({offset: 0, animated: true});
    } catch (error: any) {
      Alert.alert('خطأ', error?.data?.error || 'فشل في إرسال الرسالة');
    }
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageContainer,
        item.sender.user.id == user?.id
          ? styles.myMessage
          : styles.otherMessage,
      ]}>
      <Text
        style={
          item.sender.user.id == user?.id
            ? styles.messageTextMe
            : styles.messageText
        }>
        {item.sender.user.name ?? participantName}{' '}
      </Text>
      <Text
        style={
          item.sender.user.id == user?.id
            ? styles.messageTextMe
            : styles.messageText2
        }>
        {item.content}
      </Text>
      <Text style={styles.messageTime}>
        {new Date(item.created_at).toLocaleTimeString()}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#00C4B4" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert('خطأ', 'فشل في تحميل الرسائل');
    return <Text style={styles.errorText}>خطأ: {JSON.stringify(error)}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{participantName}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#00C4B4" />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={data?.data || []}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        inverted
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={messageContent}
          onChangeText={setMessageContent}
          placeholder="اكتب رسالة..."
          placeholderTextColor="#8E8E93"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={isSending}>
          {isSending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Icon name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2526',
  },
  backButton: {
    padding: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3A3B',
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
  messagesList: {
    padding: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  myMessage: {
    backgroundColor: '#00C4B4',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#2A3A3B',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 18,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Regular',
  },
  messageTextMe: {
    fontSize: 18,
    color: '#222',
    fontFamily: 'Tajawal-Regular',
  },

  messageText2: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
  },
  messageTime: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Tajawal-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2A3A3B',
    borderTopWidth: 1,
    borderTopColor: '#1A2526',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#1A2526',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00C4B4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF6F61',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChatScreen;
