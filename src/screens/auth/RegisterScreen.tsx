
// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
const RegisterScreen = ({ navigation, setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    grade: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //@ts-ignore
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword, studentId, grade } = formData;

    if (!fullName || !email || !password || !confirmPassword || !studentId || !grade) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return false;
    }

    if (!isValidEmail(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return false;
    }

    if (studentId.length < 4) {
      Alert.alert('خطأ', 'رقم الطالب يجب أن يكون 4 أرقام على الأقل');
      return false;
    }

    return true;
  };

  const isValidEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'تم إنشاء الحساب بنجاح',
        'مرحباً بك في مدرستي! يمكنك الآن استخدام التطبيق',
        [
          {
            text: 'موافق',
            onPress: () => setIsAuthenticated(true),
          },
        ]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Icon name="school" size={50} color="#00C4B4" />
          </View>
          <Text style={styles.title}>إنشاء حساب جديد</Text>
          <Text style={styles.subtitle}>انضم إلى مجتمع مدرستي</Text>
        </View>

        {/* Registration Form */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>الاسم الكامل *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="person" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="أدخل اسمك الكامل"
                placeholderTextColor="#8E8E93"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                textAlign="right"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>البريد الإلكتروني *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="email" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="أدخل بريدك الإلكتروني"
                placeholderTextColor="#8E8E93"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
              />
            </View>
          </View>

          {/* Student ID */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>رقم الطالب *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="badge" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="أدخل رقم الطالب"
                placeholderTextColor="#8E8E93"
                value={formData.studentId}
                onChangeText={(value) => handleInputChange('studentId', value)}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
          </View> */}

          {/* Grade */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>الصف الدراسي *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="school" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="مثال: الصف العاشر"
                placeholderTextColor="#8E8E93"
                value={formData.grade}
                onChangeText={(value) => handleInputChange('grade', value)}
                textAlign="right"
              />
            </View>
          </View> */}

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>كلمة المرور *</Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Icon
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="#8E8E93"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="أدخل كلمة المرور"
                placeholderTextColor="#8E8E93"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                textAlign="right"
              />
              <Icon name="lock" size={20} color="#8E8E93" style={styles.inputIcon} />
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>تأكيد كلمة المرور *</Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
              >
                <Icon
                  name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="#8E8E93"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="أعد إدخال كلمة المرور"
                placeholderTextColor="#8E8E93"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                textAlign="right"
              />
              <Icon name="lock" size={20} color="#8E8E93" style={styles.inputIcon} />
            </View>
          </View>

          {/* Terms and Conditions */}
          <Text style={styles.termsText}>
            بإنشاء حساب، فإنك توافق على{' '}
            <Text style={styles.termsLink}>شروط الاستخدام</Text>
            {' '}و{' '}
            <Text style={styles.termsLink}>سياسة الخصوصية</Text>
          </Text>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.loginButtonText}>جاري إنشاء الحساب...</Text>
            ) : (
              <Text style={styles.loginButtonText}>إنشاء الحساب</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.registerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerLinkText}>تسجيل الدخول</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>لديك حساب بالفعل؟ </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2526',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A3A3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#3A4A4B',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
  },
  passwordToggle: {
    padding: 4,
  },
  termsText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 20,
  },
  termsLink: {},
  
   loginButton: {
    backgroundColor: '#00C4B4',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#4A5A5B',
  },
  loginButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
  },
   registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
  },
  registerLinkText: {
    fontSize: 16,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Bold',
  },
  
})
export default RegisterScreen;
