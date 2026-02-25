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

  // Tự động cuộn xuống cuối khi có tin nhắn mới
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
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="chevron-down" size={28} color="#111" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="sparkles" size={20} color="#D4F93D" style={{marginRight: 8}} />
            <Text style={styles.headerTitle}>Chuyên gia Dinh dưỡng AI</Text>
          </View>
          <TouchableOpacity onPress={clearChat}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Khung Chat */}
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                  {!isUser && <Ionicons name="nutrition-outline" size={20} color="#111" style={styles.aiIcon} />}
                  <Text style={[styles.messageText, isUser && styles.userText]}>
                    {item.content}
                  </Text>
                </View>
              );
            }}
          />

          {/* Hiển thị Typing Indicator khi AI đang nghĩ */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#D4F93D" />
              <Text style={styles.loadingText}>AI đang soạn trả lời...</Text>
            </View>
          )}

          {/* Ô nhập tin nhắn */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Hỏi AI về bữa ăn của bạn..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]} 
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <Ionicons name="send" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFF' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  chatContainer: { padding: 15, flexGrow: 1 },
  messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 15 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#111', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row' },
  aiIcon: { marginRight: 8, marginTop: 2 },
  messageText: { fontSize: 15, lineHeight: 22, color: '#111' },
  userText: { color: '#FFF' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
  loadingText: { marginLeft: 10, color: '#6B7280', fontStyle: 'italic', fontSize: 13 },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, minHeight: 45, maxHeight: 100, fontSize: 15 },
  sendButton: { backgroundColor: '#D4F93D', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});