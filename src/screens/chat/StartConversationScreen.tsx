import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useStartConversationMutation} from '../../store/api/chatApi';
import {
  useGetParentsQuery,
  useGetTeachersQuery,
} from '../../store/api/parentApi';
import {Parent} from '../../types/parent';
import {TeacherResponse} from '../../types/theacher';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/authSlice';
import {Role} from '../../types/auth';

type User = Parent | TeacherResponse;

const StartConversationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [recipientId, setRecipientId] = useState('');
  const [recipientType, setRecipientType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [startConversation, {isLoading: isConversationLoading}] =
    useStartConversationMutation();
  const user = useSelector(selectUser);

  const userType: string =
    user?.roles.find((s: Role) => s.slug === 'parent' || s.slug === 'teacher')
      ?.slug ?? '';

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setRecipientId(user.id.toString());
    setRecipientType(userType === 'parent' ? 'teacher' : 'parent');
  };

  console.log(userType);

  const {
    data: parentsResponse,
    isLoading: parentsIsLoading,
    error: parentsError,
    refetch: refetchParents,
  } = useGetParentsQuery();

  const {
    data: teachersResponse,
    isLoading: teachersIsLoading,
    error: teachersError,
    refetch: refetchTeachers,
  } = useGetTeachersQuery();
  // Start conversation
  const handleStartConversation = async () => {
    if (!recipientId || !recipientType) {
      Alert.alert('خطأ', 'يرجى اختيار مستلم');
      return;
    }

    try {
      const response = await startConversation({
        recipient_id: parseInt(recipientId),
        recipient_type: recipientType as 'parent' | 'teacher',
        title: title || undefined,
      }).unwrap();
      Alert.alert('نجاح', 'تم بدء المحادثة بنجاح');
      //@ts-ignore
      // navigation.navigate('ChatScreen', {
      //   conversationId: response.data.id,
      //   participantName:
      //     title ||
      //     `محادثة مع ${
      //       parentsResponse?.data.find(
      //         (u: User) => u.id === parseInt(recipientId),
      //       )?.user.name || 'محادثة جديدة'
      //     }`,
      // });
    } catch (error: any) {
      Alert.alert('خطأ', error?.data?.error || 'فشل في بدء المحادثة');
    }
  };

  // Render each user in the list
  const renderUser = ({item}: {item: User}) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        recipientId === item.id.toString() && styles.selectedUser,
      ]}
      onPress={() => handleSelectUser(item)}>
      <Text style={styles.userName}>{item.user.name}</Text>
      {/* <Text style={styles.userType}>
        {userType === 'parent' ? 'معلم' : 'ولي أمر'}
      </Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>بدء محادثة جديدة</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#00C4B4" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {userType === 'parent' ? (
          teachersIsLoading ? (
            <ActivityIndicator color="#00C4B4" size="large" />
          ) : teachersError ? (
            <Text style={styles.errorText}>فشل في تحميل المستخدمين</Text>
          ) : (
            <>
              <Text style={styles.label}>اختر المستلم</Text>
              <FlatList
                data={teachersResponse?.data}
                renderItem={renderUser}
                keyExtractor={item => item.id.toString()}
                style={styles.userList}
                ListEmptyComponent={
                  <Text style={styles.noUsersText}>لا يوجد مستخدمين</Text>
                }
              />
            </>
          )
        ) : parentsIsLoading ? (
          <ActivityIndicator color="#00C4B4" size="large" />
        ) : parentsError ? (
          <Text style={styles.errorText}>فشل في تحميل المستخدمين</Text>
        ) : (
          <>
            <Text style={styles.label}>اختر المستلم</Text>
            <FlatList
              data={parentsResponse?.data}
              renderItem={renderUser}
              keyExtractor={item => item.id.toString()}
              style={styles.userList}
              ListEmptyComponent={
                <Text style={styles.noUsersText}>لا يوجد مستخدمين</Text>
              }
            />
          </>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            isConversationLoading && styles.disabledButton,
          ]}
          onPress={handleStartConversation}
          disabled={isConversationLoading}>
          {isConversationLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>بدء المحادثة</Text>
              <Icon
                name="send"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            </>
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
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
  form: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
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
  userList: {
    marginBottom: 16,
  },
  userItem: {
    backgroundColor: '#1A2526',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedUser: {
    backgroundColor: '#00C4B4',
  },
  userName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
  },
  userType: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
  },
  noUsersText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    fontFamily: 'Tajawal-Regular',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#00C4B4',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#00C4B4',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 10,
  },
});

export default StartConversationScreen;
