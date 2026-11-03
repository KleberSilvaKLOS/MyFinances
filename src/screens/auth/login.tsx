/**
 * ============================================================================
 * TELA DE AUTENTICAÇÃO (Google, Facebook e E-mail)
 * ============================================================================
 */

import React, { useState } from 'react';
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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext';
import { styles } from './styles';

export default function LoginScreen() {
  const { theme, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

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
        Alert.alert('Conta criada', 'Cadastro realizado com sucesso!');
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      }
    } catch (error: any) {
      let msg = 'Não foi possível completar a operação.';
      if (error.code === 'auth/invalid-email') msg = 'Formato de e-mail inválido.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = 'E-mail ou senha incorretos.';
      }
      if (error.code === 'auth/email-already-in-use') msg = 'Este e-mail já está em uso.';
      if (error.code === 'auth/weak-password') msg = 'A senha deve conter no mínimo 6 dígitos.';
      Alert.alert('Erro de Acesso', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLoginPlaceholder = (provider: string) => {
    Alert.alert(
      `Login com ${provider}`,
      `O fluxo nativo de autenticação com o ${provider} usa a chave do Firebase criada no projeto my-finances-app-abc25.`
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
        {/* CABEÇALHO COM LOGOTIPO */}
        <View style={styles.headerBox}>
          <View style={styles.logoBadge}>
            <Ionicons name="wallet" size={32} color="#ffffff" />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>My Finances</Text>
          <Text style={[styles.appTagline, { color: theme.subtext }]}>
            Controle financeiro seguro sincronizado na nuvem
          </Text>
        </View>

        {/* CARD DO FORMULÁRIO */}
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

          {/* Botão Entrar/Cadastrar */}
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

          {/* Alternar entre login e cadastro */}
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
          {/* Google */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => handleSocialLoginPlaceholder('Google')}
          >
            <FontAwesome5 name="google" size={18} color="#ea4335" />
            <Text style={[styles.socialButtonText, { color: theme.text }]}>
              Entrar com o Google
            </Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => handleSocialLoginPlaceholder('Facebook')}
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