// src/screens/LoginScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {login} from '../../store/authSlice';

//@ts-ignore
const LoginScreen = ({navigation, setIsAuthenticated}) => {
  const {token} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('ahmed.teacher@school.com');
  const [password, setPassword] = useState<string>('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const {isLoading} = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    try {
      // @ts-ignore
      await dispatch(login({email, password})).unwrap().then(() => {
      });

    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('خطأ', 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
    }

  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Logo and Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* <Icon name="school" size={60} color="#00C4B4" /> */}
            <Image
              source={require('../../assets/iamges/logo.jpeg')}
              style={{width: 80, height: 80 ,borderRadius: 40}}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>مدرستي</Text>
          <Text style={styles.welcomeText}>مرحباً بك مرة أخرى</Text>
          <Text style={styles.subtitle}>قم بتسجيل الدخول للمتابعة</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="email"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="أدخل بريدك الإلكتروني"
                placeholderTextColor="#8E8E93"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>كلمة المرور</Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}>
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
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textAlign="right"
              />
              <Icon
                name="lock"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* Forgot Password */}
          {/* <TouchableOpacity style={styles.forgotPasswordContainer}> */}
            {/* <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text> */}
          {/* </TouchableOpacity> */}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <Text style={styles.loginButtonText}>جاري تسجيل الدخول...</Text>
            ) : (
              <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          {/* <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View> */}

          {/* Social Login Options */}
          {/* <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="g-translate" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View> */}

          {/* Register Link */}
          {/* <View style={styles.registerContainer}> */}
            {/* <TouchableOpacity onPress={() => navigation.navigate('Register')}> */}
              {/* <Text style={styles.registerLinkText}>إنشاء حساب جديد</Text> */}
            {/* </TouchableOpacity> */}
            {/* <Text style={styles.registerText}>ليس لديك حساب؟ </Text> */}
          {/* </View> */}
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2A3A3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 20,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Regular',
    marginBottom: 4,
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
    marginBottom: 20,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#00C4B4',
    fontFamily: 'Tajawal-Regular',
  },
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3A4A4B',
  },
  dividerText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Tajawal-Regular',
    paddingHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A3A3B',
    borderRadius: 12,
    height: 50,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#3A4A4B',
  },
  socialButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    marginLeft: 8,
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
});

export default LoginScreen;
