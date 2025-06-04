import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import {
  useGetParentsQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
} from '../store/api/parentApi';
import { hasPermission } from '../store/authSlice';
import { ParentPayload, Parent } from '../types/parent';
import { RootState } from '../store/store';
import PullToRefresh from '../components/PullToRefresh';
import useRefresh from '../hooks/useRefresh';

const ParentScreen: React.FC = () => {
  // Fixed selector: Directly use hasPermission
  const canManageParents = useSelector((state: RootState) =>
    hasPermission(state, 'manage-parent_students') || hasPermission(state, 'view-parent_students')
  );

  // RTK Query hooks for Parents
  const {
    data: parentsResponse,
    isLoading: parentsIsLoading,
    error: parentsError,
    refetch: refetchParents,
  } = useGetParentsQuery();
  const [createParent] = useCreateParentMutation();
  const [updateParent] = useUpdateParentMutation();
  const [deleteParent] = useDeleteParentMutation();

  // Form state
  const [formData, setFormData] = useState<ParentPayload>({
    name: '',
    email: '',
    password: '',
    user_id: undefined,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Debug log in useEffect
  useEffect(() => {
    console.log('Parents Response:', parentsResponse);
  }, [parentsResponse]);

  // Handle form input changes
  const handleInputChange = (name: keyof ParentPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'user_id' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  // Handle form submission for create/update
  const handleSubmit = async () => {
    try {
      if (!editingId) {
        // Creation: Validate required fields
        if (!formData.name || !formData.email || !formData.password) {
          Alert.alert(
            'خطأ',
            'يرجى إدخال الاسم، البريد الإلكتروني، وكلمة المرور',
          );
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          Alert.alert('خطأ', 'البريد الإلكتروني غير صالح');
          return;
        }
        if (formData.password.length < 8) {
          Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
          return;
        }
        await createParent(formData).unwrap();
        setFormData({ name: '', email: '', password: '', user_id: undefined });
        Alert.alert('نجاح', 'تم إنشاء ولي الأمر بنجاح');
      } else {
        // Update: Validate required fields
        if (!formData.name) {
          Alert.alert('خطأ', 'الاسم مطلوب');
          return;
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          Alert.alert('خطأ', 'البريد الإلكتروني غير صالح');
          return;
        }
        if (formData.password && formData.password.length < 8) {
          Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
          return;
        }

        // Prepare update data
        const updateData: Partial<ParentPayload> = {
          name: formData.name,
          email: formData.email || undefined,
          password: formData.password || undefined,
          user_id: formData.user_id,
        };

        console.log('Update parent payload:', updateData);

        await updateParent({ id: editingId, data: updateData }).unwrap();
        setFormData({ name: '', email: '', password: '', user_id: undefined });
        setEditingId(null);
        Alert.alert('نجاح', 'تم تحديث ولي الأمر بنجاح');
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.errors?.name?.[0] ||
        err?.data?.errors?.email?.[0] ||
        err?.data?.errors?.password?.[0] ||
        err?.data?.errors?.user_id?.[0] ||
        err?.data?.message ||
        'حدث خطأ';
      Alert.alert('خطأ', errorMessage);
      console.error('Error:', err);
    }
  };

  // Handle edit button click
  const handleEdit = (parent: Parent & { id: number }) => {
    setFormData({
      name: parent.user.name,
      email: parent.user.email,
      password: '',
      user_id: parent.user_id,
    });
    setEditingId(parent.id);
  };

  // Handle delete button click
  const handleDelete = async (id: number) => {
    try {
      await deleteParent(id).unwrap();
      Alert.alert('نجاح', 'تم حذف ولي الأمر بنجاح');
    } catch (err: any) {
      Alert.alert('خطأ', err?.data?.message || 'خطأ في حذف ولي الأمر');
      console.error('Error deleting parent:', err);
    }
  };

  if (!canManageParents) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إدارة أولياء الأمور</Text>
        </View>
        <Text style={styles.errorText}>
          ليس لديك إذن لعرض أو إدارة أولياء الأمور
        </Text>
      </ScrollView>
    );
  }

  const { refreshing, handleRefresh } = useRefresh([refetchParents]);

  return (
    <View style={styles.container}>
      <PullToRefresh refreshing={refreshing} onRefresh={handleRefresh}>
        <View style={styles.header}>
          <Text style={styles.title}>إدارة أولياء الأمور</Text>
        </View>

        {parentsIsLoading && <ActivityIndicator size="large" color="#00C4B4" />}
        {parentsError && (
          <Text style={styles.errorText}>
            خطأ: {JSON.stringify(parentsError)}
          </Text>
        )}

        {/* Form for creating/updating parents */}
        <View style={styles.form}>
          <Text style={styles.label}>الاسم</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
            placeholder="أدخل الاسم"
            autoCapitalize="words"
            placeholderTextColor="#8E8E93"
          />

          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            placeholder="أدخل البريد الإلكتروني"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#8E8E93"

          />

          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={value => handleInputChange('password', value)}
            placeholder="أدخل كلمة المرور (اختياري للتعديل)"
            secureTextEntry
            placeholderTextColor="#8E8E93"

          />

          <Text style={styles.label}>معرف المستخدم</Text>
          <TextInput
            style={styles.input}
            value={formData.user_id ? formData.user_id.toString() : ''}
            onChangeText={value => handleInputChange('user_id', value)}
            keyboardType="numeric"
            placeholder="أدخل معرف المستخدم (اختياري)"
            placeholderTextColor="#8E8E93"
            editable={false} // Only editable during update
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {editingId ? 'تحديث ولي الأمر' : 'إضافة ولي الأمر'}
            </Text>
            <Icon
              name={editingId ? 'save' : 'add'}
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>

        {/* List of parents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>قائمة أولياء الأمور</Text>
          {parentsResponse?.data.map(parent => (
            <View key={parent.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.parentName}>{parent.user.name}</Text>
                <Text style={styles.parentInfo}>
                  <Text style={styles.infoLabel}>البريد الإلكتروني: </Text>
                  {parent.user.email}
                </Text>
                <Text style={styles.parentInfo}>
                  <Text style={styles.infoLabel}>معرف المستخدم: </Text>
                  {parent.user_id}
                </Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(parent)}>
                  <Icon name="edit" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(parent.id)}>
                  <Icon name="delete" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </PullToRefresh>
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
  form: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 8,
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
  button: {
    backgroundColor: '#00C4B4',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  parentName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 8,
  },
  parentInfo: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 4,
  },
  infoLabel: {
    color: '#00C4B4',
  },
  cardActions: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#FFD700',
  },
  deleteButton: {
    backgroundColor: '#FF6F61',
  },
  errorText: {
    color: '#FF6F61',
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
    margin: 20,
  },
});

export default React.memo(ParentScreen);