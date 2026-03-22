// components/nutrition/AiChatModal.tsx
import { useAIChat } from '@/hooks/notrition/useAIChat';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AiChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AiChatModal({ visible, onClose }: AiChatModalProps) {
  const [inputText, setInputText] = useState('');
  const { messages, loading, sendMessage, clearChat } = useAIChat();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header Modal */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Ionicons name="chevron-down" size={24} color="#111" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="sparkles" size={18} color="#D4F93D" style={{ marginRight: 6 }} />
            <Text style={styles.headerTitle}>Chuyên gia Dinh dưỡng</Text>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.iconBtnDel}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Khung Chat */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatContainer}
            renderItem={({ item }) => {
              const isUser = item.role === 'user';
              return (
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
                  {!isUser && <View style={styles.aiIconWrap}><Ionicons name="nutrition" size={16} color="#FFF" /></View>}
                  <Text style={[styles.messageText, isUser && styles.userText]}>
                    {item.content}
                  </Text>
                </View>
              );
            }}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#D4F93D" />
              <Text style={styles.loadingText}>AI đang phân tích...</Text>
            </View>
          )}

          {/* Ô nhập tin nhắn */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Bạn muốn ăn gì hôm nay?"
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && { backgroundColor: '#F3F4F6', shadowOpacity: 0 }]}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={18} color={!inputText.trim() ? '#9CA3AF' : '#111'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: '#FAFAFA' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  iconBtnDel: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, shadowColor: '#111', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  headerTitle: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  chatContainer: { padding: 20, flexGrow: 1, paddingBottom: 40 },
  messageBubble: { maxWidth: '85%', padding: 16, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#111', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#F3F4F6', flexDirection: 'row', alignItems: 'flex-start' },
  aiIconWrap: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 2 },
  messageText: { fontSize: 15, lineHeight: 24, color: '#111', flexShrink: 1, fontWeight: '500' },
  userText: { color: '#FFF' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingBottom: 15 },
  loadingText: { marginLeft: 10, color: '#6B7280', fontStyle: 'italic', fontSize: 13, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6', alignItems: 'flex-end', paddingBottom: Platform.OS === 'ios' ? 60 : 40 },
  input: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 24, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14, minHeight: 48, maxHeight: 120, fontSize: 16, color: '#111', borderWidth: 1, borderColor: '#F1F5F9' },
  sendButton: { backgroundColor: '#D4F93D', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 12, shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 2 }
});