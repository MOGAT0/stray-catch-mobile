import { useSignIn, useSignUp, useSSO } from '@clerk/clerk-expo';
import Ionicons from '@react-native-vector-icons/ionicons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const COLORS = {
  primary: '#000000',       
  inactive: '#808080',      
  background: '#FFFFFF',    
  border: '#E0E0E0', 
  cardBg: '#FFFFFF',
  inputBg: '#FCF9F2',     
  alertOrange: '#FF6B35',
};

const AuthScreen = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
 
  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
 
    setLoading(true);
 
    try {
      if (authMode === 'signin') {
        if (!isSignInLoaded) return;
 
        const result = await signIn.create({
          identifier: email,
          password,
        });
 
        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          router.replace('/');
        } else {
          console.log('Sign in result:', result);
        }
      } else {
        if (!isSignUpLoaded) return;
 
        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName: name,
        });
 
        if (result.status === 'complete') {
          await setSignUpActive({ session: result.createdSessionId });
          router.replace('/');
        } else if (result.status === 'missing_requirements') {
          // Handle email verification if needed
          console.log('Additional verification required');
        }
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
 
  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);

    try {
      const { createdSessionId, setActive, authSessionResult } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: Linking.createURL('/', { scheme: 'straycatchmobile' }),
      });

      if (authSessionResult?.type === 'cancel' || authSessionResult?.type === 'dismiss') {
        return;
      }

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  }, [router, startSSOFlow]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollWrapper} keyboardShouldPersistTaps="handled">
        
        {/* The Hard Shadow Wrapper */}
        <View style={styles.shadowWrapper}>
          <View style={styles.cardContainer}>
            
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.iconWrapper}>
                <Image 
                    source={require('../../../assets/images/StrayCatcher-Logo-v2.png')} 
                    style={styles.logoImage} 
                    resizeMode="contain" 
                />
                </View>
              <Text style={styles.headerTitle}>
                {authMode === 'signin' ? 'WELCOME BACK' : 'JOIN THE NETWORK'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {authMode === 'signin' 
                  ? 'Ready to snap some strays?' 
                  : 'Become an official Stray Lover'}
              </Text>
            </View>

            {/* Auth Toggle Switcher */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setAuthMode('signin')}
                style={[
                  styles.toggleButton,
                  authMode === 'signin' ? styles.toggleActive : styles.toggleInactive,
                ]}
              >
                <Ionicons 
                  name="log-in" 
                  size={16} 
                  color={authMode === 'signin' ? '#FFFFFF' : COLORS.inactive} 
                />
                <Text style={[
                  styles.toggleText,
                  authMode === 'signin' ? styles.toggleTextActive : styles.toggleTextInactive
                ]}>SIGN IN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAuthMode('register')}
                style={[
                  styles.toggleButton,
                  authMode === 'register' ? styles.toggleActive : styles.toggleInactive,
                ]}
              >
                <Ionicons 
                  name="person-add" 
                  size={16} 
                  color={authMode === 'register' ? '#FFFFFF' : COLORS.inactive} 
                />
                <Text style={[
                  styles.toggleText,
                  authMode === 'register' ? styles.toggleTextActive : styles.toggleTextInactive
                ]}>REGISTER</Text>
              </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              
              {/* Only show Name input if in Register mode */}
              {authMode === 'register' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FULL NAME / HANDLE</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Sam Stray Guardian"
                    placeholderTextColor={COLORS.inactive}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="stray@lover.com"
                  placeholderTextColor={COLORS.inactive}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="********"
                    placeholderTextColor={COLORS.inactive}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={isPasswordVisible ? "eye-off" : "eye"} 
                      size={20} 
                      color={COLORS.inactive} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Social Login Button (Google) */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.googleShadowWrapper}
                onPress={handleGoogleLogin}
                disabled={loading}
              >
                <View style={[styles.googleButton, loading && styles.buttonDisabled]}>
                  <Ionicons 
                    name="logo-google" 
                    size={18} 
                    color={COLORS.primary} 
                  />
                  <Text style={styles.googleButtonText}>
                    {loading ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Chunky Submit Button */}
              <TouchableOpacity activeOpacity={0.8} style={styles.buttonShadowWrapper} onPress={handleSubmit}>
                <View style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>
                    {authMode === 'signin' ? 'LOG IN TO ACCOUNT' : 'CREATE ACCOUNT'}
                  </Text>
                  <Ionicons 
                    name={authMode === 'signin' ? "arrow-forward" : "sparkles"} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                </View>
              </TouchableOpacity>

            </View>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  shadowWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingBottom: 6,
    paddingRight: 6,
  },
  cardContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.inactive,
    marginTop: 6,
  },
  // Toggle Switcher Styles
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBg,
    marginHorizontal: 24,
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  toggleActive: {
    backgroundColor: COLORS.alertOrange,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  toggleInactive: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '900',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInactive: {
    color: COLORS.inactive,
  },
  // Form Styles
  formContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    height: 54,
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  // Password Input Styles
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 16,
    height: 54,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  eyeIcon: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Google Button Styles
  googleShadowWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingBottom: 4,
    paddingRight: 4,
    marginTop: 12,
    marginBottom: 8,
  },
  googleButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  googleButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Primary Submit Button Styles
  buttonShadowWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingBottom: 4,
    paddingRight: 4,
    marginTop: 4,
  },
  submitButton: {
    height: 56,
    backgroundColor: COLORS.alertOrange,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});