/**
 * ============================================================================
 * TELA DE CONFIGURAÇÕES (Samsung One UI)
 * Preferências visuais, gerenciamento de dados locais e sessão do Firebase Auth.
 * ============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ionicons,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';

import { auth } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext';
import { styles } from './styles';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { theme, isDark, toggleTheme } = useTheme();
  const currentUser = auth.currentUser;

  const handleSignOut = () => {
    Alert.alert('Encerrar Sessão', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível encerrar a sessão.');
          }
        },
      },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Deseja redefinir os seletores e chaves temporárias? Seus lançamentos e cartões serão preservados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@myfinance:last_card_id');
              Alert.alert('Sucesso', 'Cache temporário limpo com sucesso.');
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível limpar o cache.');
            }
          },
        },
      ]
    );
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Atenção Máxima',
      'Deseja apagar todos os registros, cartões e contas salvos localmente no aparelho? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Concluído', 'Todos os dados locais foram apagados.');
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível limpar o armazenamento.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* --- CABEÇALHO ONE UI --- */}
      <View style={styles.header}>
        <View style={styles.headerNavRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.headerLargeTitle, { color: theme.text }]}>
          Configurações
        </Text>
        <Text style={[styles.headerSub, { color: theme.subtext }]}>
          Preferências, segurança e aplicativo
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* GRUPO 1: CONTA & SEGURANÇA */}
        {/* ============================================================ */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Conta & Segurança
        </Text>
        <View style={[styles.groupCard, { backgroundColor: theme.card }]}>
          {/* Perfil Conectado */}
          <TouchableOpacity
            style={[styles.itemRow, styles.itemBorder]}
            onPress={() =>
              Alert.alert(
                'Sessão Ativa',
                `Conectado como:\n${currentUser?.email || 'Usuário Local'}`
              )
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: '#3870d8' }]}>
              <Feather name="user" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Perfil de Usuário
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: theme.subtext }]}
                numberOfLines={1}
              >
                {currentUser?.email || 'Modo offline / Convidado'}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>

          {/* Biometria */}
          <TouchableOpacity
            style={[styles.itemRow, styles.itemBorder]}
            onPress={() =>
              Alert.alert('Segurança', 'Bloqueio biométrico ativo para proteção dos registros.')
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: '#10b981' }]}>
              <MaterialCommunityIcons name="fingerprint" size={20} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Bloqueio por Biometria
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Exigir autenticação ao abrir o app
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>

          {/* Encerrar Sessão */}
          <TouchableOpacity style={styles.itemRow} onPress={handleSignOut}>
            <View style={[styles.iconCircle, { backgroundColor: '#ef4444' }]}>
              <Feather name="log-out" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: '#ef4444' }]}>
                Encerrar Sessão
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Desconectar a conta deste aparelho
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* GRUPO 2: APARÊNCIA */}
        {/* ============================================================ */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Aparência
        </Text>
        <View style={[styles.groupCard, { backgroundColor: theme.card }]}>
          <View style={styles.itemRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#8b5cf6' }]}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={18}
                color="#fff"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Tema Escuro
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                {isDark ? 'Ativado' : 'Desativado'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#cbd5e1', true: '#3870d8' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* ============================================================ */}
        {/* GRUPO 3: DADOS & ARMAZENAMENTO */}
        {/* ============================================================ */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Dados & Armazenamento
        </Text>
        <View style={[styles.groupCard, { backgroundColor: theme.card }]}>
          {/* Limpar Cache */}
          <TouchableOpacity
            style={[styles.itemRow, styles.itemBorder]}
            onPress={handleClearCache}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#f59e0b' }]}>
              <Feather name="refresh-cw" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Limpar Cache
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Redefinir estados de visualização e filtros
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>

          {/* Reset Geral */}
          <TouchableOpacity style={styles.itemRow} onPress={handleResetAllData}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Feather name="trash-2" size={18} color="#ef4444" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: '#ef4444' }]}>
                Apagar Todos os Dados Locais
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Restaurar banco local ao estado original
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* GRUPO 4: INFORMAÇÕES DO APP */}
        {/* ============================================================ */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Sobre
        </Text>
        <View style={[styles.groupCard, { backgroundColor: theme.card }]}>
          <View style={[styles.itemRow, styles.itemBorder]}>
            <View style={[styles.iconCircle, { backgroundColor: '#64748b' }]}>
              <Feather name="info" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Versão do Aplicativo
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                MyFinances Pro v1.2.0 (Build Firebase)
              </Text>
            </View>
            <Text style={[styles.itemStatusText, { color: theme.subtext }]}>
              Estável
            </Text>
          </View>

          <TouchableOpacity
            style={styles.itemRow}
            onPress={() =>
              Alert.alert(
                'MyFinances Pro',
                'Arquitetura móvel modular com React Native, TypeScript, Expo e Firebase Cloud Auth.'
              )
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: '#0284c7' }]}>
              <Feather name="code" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Desenvolvimento
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Engenharia de Software
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}