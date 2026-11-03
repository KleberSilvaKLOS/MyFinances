/**
 * ============================================================================
 * TELA DE AUTENTICAÇÃO (Google & E-mail com Firebase Auth)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import { auth } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext';
import { styles } from './styles';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '101659990601-7s45s396coaki0udt2u9out69s2h98tg.apps.googleusercontent.com';

export default function LoginScreen() {
  const { theme, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Hook de autenticação OAuth do Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      if (id_token) {
        setLoading(true);
        const credential = GoogleAuthProvider.credential(id_token);

        signInWithCredential(auth, credential)
          .catch((error) => {
            console.log('Erro ao autenticar com Google no Firebase:', error);
            Alert.alert('Falha no Login', 'Não foi possível concluir o login com o Google.');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [response]);

  const handleEmailAuth = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Campos vazios', 'Informe o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      }
    } catch (error: any) {
      console.log('Erro Firebase Auth:', error.code, error.message);

      // Se tentar logar com credenciais não cadastradas, oferece criar a conta na hora
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found'
      ) {
        if (!isRegistering) {
          Alert.alert(
            'Conta não encontrada',
            'Não encontramos uma conta cadastrada com esses dados. Deseja criar sua conta agora?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Criar Conta',
                onPress: async () => {
                  try {
                    setLoading(true);
                    await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
                    Alert.alert('Sucesso', 'Conta criada com sucesso!');
                  } catch (createErr: any) {
                    Alert.alert('Erro ao criar conta', createErr.message);
                  } finally {
                    setLoading(false);
                  }
                },
              },
            ]
          );
          return;
        }
      }

      let msg = 'Não foi possível completar a operação.';
      if (error.code === 'auth/operation-not-allowed') {
        msg = 'O login por E-mail/Senha precisa ser ativado no Firebase Console (Authentication > Sign-in method).';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Formato de e-mail inválido.';
      } else if (error.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está cadastrado. Alterne para o modo de login.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'A senha deve conter pelo menos 6 caracteres.';
      }

      Alert.alert('Atenção', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookPlaceholder = () => {
    Alert.alert(
      'Login com Facebook',
      'Para habilitar o Facebook Login, configure o App ID no Meta for Developers e adicione ao Firebase.'
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={styles.headerBox}>
          <View style={styles.logoBadge}>
            <Ionicons name="wallet" size={32} color="#ffffff" />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>My Finances</Text>
          <Text style={[styles.appTagline, { color: theme.subtext }]}>
            Controle financeiro seguro sincronizado na nuvem
          </Text>
        </View>

        {/* CARD FORMULÁRIO */}
        <View style={[styles.cardForm, { backgroundColor: theme.card }]}>
          {/* E-mail */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.subtext }]}>E-mail</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.input }]}>
              <Feather name="mail" size={18} color={theme.subtext} />
              <TextInput
                style={[styles.textInput, { color: theme.text }]}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor={theme.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.subtext }]}>Senha</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.input }]}>
              <Feather name="lock" size={18} color={theme.subtext} />
              <TextInput
                style={[styles.textInput, { color: theme.text }]}
                placeholder="••••••••"
                placeholderTextColor={theme.subtext}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={theme.subtext}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Principal */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleEmailAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.btnPrimaryText}>
                {isRegistering ? 'Criar Conta' : 'Acessar Conta'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Alternar Cadastro / Login */}
          <TouchableOpacity
            onPress={() => setIsRegistering(!isRegistering)}
            style={{ marginTop: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#3870d8', fontSize: 13, fontWeight: '600' }}>
              {isRegistering
                ? 'Já possui uma conta? Faça login'
                : 'Não tem conta? Cadastre-se'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DIVISOR */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerText, { color: theme.subtext }]}>ou continue com</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        {/* BOTÕES SOCIAIS */}
        <View style={styles.socialButtonsCol}>
          {/* Botão Google */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: theme.card, borderColor: theme.border },
              (!request || loading) && { opacity: 0.7 },
            ]}
            onPress={() => promptAsync()}
            disabled={!request || loading}
          >
            <FontAwesome5 name="google" size={18} color="#ea4335" />
            <Text style={[styles.socialButtonText, { color: theme.text }]}>
              Entrar com o Google
            </Text>
          </TouchableOpacity>

          {/* Botão Facebook */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={handleFacebookPlaceholder}
          >
            <FontAwesome5 name="facebook" size={18} color="#1877f2" />
            <Text style={[styles.socialButtonText, { color: theme.text }]}>
              Entrar com o Facebook
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footerNote, { color: theme.subtext }]}>
          Seus dados permanecem vinculados ao seu ID do Firebase e são restaurados automaticamente ao trocar de aparelho.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}