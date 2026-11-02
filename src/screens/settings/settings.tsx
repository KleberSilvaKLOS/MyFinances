/**
 * ============================================================================
 * TELA DE CONFIGURAÇÕES (Estilo Samsung One UI)
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

import { useTheme } from '../../context/ThemeContext';
import { styles } from './styles';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleClearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Deseja redefinir os dados temporários? Seus lançamentos e cartões serão mantidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@myfinance:last_card_id');
              Alert.alert('Sucesso', 'Cache limpo com sucesso.');
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
      'Deseja apagar TODOS os lançamentos, cartões e contas salvas no aplicativo? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Reiniciado', 'Todos os dados foram excluídos.');
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
        {/* GRUPO 1: CONTA & LOGIN */}
        {/* ============================================================ */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Conta & Segurança
        </Text>
        <View style={[styles.groupCard, { backgroundColor: theme.card }]}>
          {/* Perfil */}
          <TouchableOpacity
            style={[styles.itemRow, styles.itemBorder]}
            onPress={() => Alert.alert('Perfil', 'Sessão ativa localmente no dispositivo.')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#3870d8' }]}>
              <Feather name="user" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Perfil de Usuário
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Gerenciar credenciais e login
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>

          {/* Autenticação & Biometria */}
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => Alert.alert('Segurança', 'Bloqueio do app por biometria ativado.')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#10b981' }]}>
              <MaterialCommunityIcons name="fingerprint" size={20} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Bloqueio por Biometria
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Exigir digital para abrir o aplicativo
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
          {/* Alternar Modo Escuro */}
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
                Restaurar seletores e estados temporários
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>

          {/* Reset Total */}
          <TouchableOpacity
            style={styles.itemRow}
            onPress={handleResetAllData}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#ef4444' }]}>
              <Feather name="trash-2" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: '#ef4444' }]}>
                Apagar Todos os Dados
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                Redefinir aplicativo do zero
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* GRUPO 4: SOBRE O APLICATIVO */}
        {/* ============================================================ */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Sobre
        </Text>
        <View style={[styles.groupCard, { backgroundColor: theme.card }]}>
          {/* Informações da Versão */}
          <View style={[styles.itemRow, styles.itemBorder]}>
            <View style={[styles.iconCircle, { backgroundColor: '#64748b' }]}>
              <Feather name="info" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Versão do Aplicativo
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.subtext }]}>
                MyFinances Pro v1.2.0
              </Text>
            </View>
            <Text style={[styles.itemStatusText, { color: theme.subtext }]}>
              Atualizado
            </Text>
          </View>

          {/* Desenvolvedor / Suporte */}
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => Alert.alert('Desenvolvimento', 'MyFinances • Feito com React Native e Expo.')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#0284c7' }]}>
              <Feather name="code" size={18} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Desenvolvido por
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