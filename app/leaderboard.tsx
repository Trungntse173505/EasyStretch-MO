import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LEADERBOARD_DATA = {
  chuoi: [
    { id: 1, name: "Minh Lộc", username: "@username", points: 24, rank: 1, avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 2, name: "Thái Ngọc", username: "@username", points: 18, rank: 2, avatar: "https://i.pravatar.cc/150?img=12" },
    { id: 3, name: "Nhật Khang", username: "@username", points: 16, rank: 3, avatar: "https://i.pravatar.cc/150?img=33" },
    { id: 4, name: "Thành Trung", username: "@TrungSieuVipPro", points: 11, rank: 4, avatar: "https://i.pravatar.cc/150?img=14", trend: 'up' },
    { id: 5, name: "Minh Nhật", username: "@Nhat123", points: 8, rank: 5, avatar: "https://i.pravatar.cc/150?img=15", trend: 'down' },
    { id: 6, name: "Lê Duy", username: "@DuyLeader", points: 7, rank: 6, avatar: "https://i.pravatar.cc/150?img=16", trend: 'up' },
    { id: 7, name: "Minh Khoa", username: "@VipDesign", points: 5, rank: 7, avatar: "https://i.pravatar.cc/150?img=17", trend: 'up' },
    { id: 8, name: "Quang Trường", username: "@TruongCOCC", points: 3, rank: 8, avatar: "https://i.pravatar.cc/150?img=18", trend: 'down' },
  ],
  diem: [
    { id: 1, name: "Minh Lộc", username: "@username", points: 2430, rank: 1, avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 2, name: "Thái Ngọc", username: "@username", points: 1847, rank: 2, avatar: "https://i.pravatar.cc/150?img=12" },
    { id: 3, name: "Nhật Khang", username: "@username", points: 1674, rank: 3, avatar: "https://i.pravatar.cc/150?img=33" },
    { id: 4, name: "Thành Trung", username: "@TrungSieuVipPro", points: 1124, rank: 4, avatar: "https://i.pravatar.cc/150?img=14", trend: 'up' },
    { id: 5, name: "Minh Nhật", username: "@Nhat123", points: 875, rank: 5, avatar: "https://i.pravatar.cc/150?img=15", trend: 'down' },
    { id: 6, name: "Lê Duy", username: "@DuyLeader", points: 774, rank: 6, avatar: "https://i.pravatar.cc/150?img=16", trend: 'up' },
    { id: 7, name: "Minh Khoa", username: "@VipDesign", points: 723, rank: 7, avatar: "https://i.pravatar.cc/150?img=17", trend: 'up' },
    { id: 8, name: "Quang Trường", username: "@TruongCOCC", points: 559, rank: 8, avatar: "https://i.pravatar.cc/150?img=18", trend: 'down' },
  ]
};

export default function LeaderboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chuoi' | 'diem'>('chuoi');

  const currentData = LEADERBOARD_DATA[activeTab];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#4785FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bảng xếp hạng</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tabs */}
        <View style={styles.lbTabsRow}>
          <TouchableOpacity 
            style={activeTab === 'chuoi' ? styles.lbTabActive : styles.lbTab}
            onPress={() => setActiveTab('chuoi')}
          >
            <Text style={activeTab === 'chuoi' ? styles.lbTabTextActive : styles.lbTabText}>Chuỗi</Text>
            {activeTab === 'chuoi' && <View style={styles.lbTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={activeTab === 'diem' ? styles.lbTabActive : styles.lbTab}
            onPress={() => setActiveTab('diem')}
          >
             <Text style={activeTab === 'diem' ? styles.lbTabTextActive : styles.lbTabText}>Điểm</Text>
             {activeTab === 'diem' && <View style={styles.lbTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Podium */}
        <View style={styles.podiumContainer}>
          {/* Rank 2 */}
          <View style={[styles.podiumItem, { marginTop: 40 }]}>
             <View style={styles.avatarWrap2}>
               <Image source={{ uri: currentData[1].avatar }} style={styles.podiumAvatar2} />
               <View style={styles.rankBadge2}>
                 <Text style={styles.rankBadgeText}>2</Text>
               </View>
             </View>
             <Text style={styles.podiumName}>{currentData[1].name}</Text>
             <Text style={styles.podiumPoints2}>{currentData[1].points}</Text>
             <Text style={styles.podiumUser}>{currentData[1].username}</Text>
          </View>
          
          {/* Rank 1 */}
          <View style={[styles.podiumItem, { zIndex: 10 }]}>
             <MaterialCommunityIcons name="crown" size={36} color="#FBBF24" style={styles.crownIcon} />
             <View style={styles.avatarWrap1}>
               <Image source={{ uri: currentData[0].avatar }} style={styles.podiumAvatar1} />
               <View style={styles.rankBadge1}>
                 <Text style={styles.rankBadgeText}>1</Text>
               </View>
             </View>
             <Text style={styles.podiumName}>{currentData[0].name}</Text>
             <Text style={styles.podiumPoints1}>{currentData[0].points}</Text>
             <Text style={styles.podiumUser}>{currentData[0].username}</Text>
          </View>

          {/* Rank 3 */}
           <View style={[styles.podiumItem, { marginTop: 50 }]}>
             <View style={styles.avatarWrap3}>
               <Image source={{ uri: currentData[2].avatar }} style={styles.podiumAvatar3} />
               <View style={styles.rankBadge3}>
                 <Text style={styles.rankBadgeText}>3</Text>
               </View>
             </View>
             <Text style={styles.podiumName}>{currentData[2].name}</Text>
             <Text style={styles.podiumPoints3}>{currentData[2].points}</Text>
             <Text style={styles.podiumUser}>{currentData[2].username}</Text>
          </View>
        </View>

        {/* List rest */}
        <View style={styles.lbListContainer}>
           {currentData.slice(3).map(user => (
             <View key={user.id} style={styles.lbListItem}>
               <View style={styles.lbListLeft}>
                 <Image source={{ uri: user.avatar }} style={styles.lbListAvatar} />
                 <View>
                   <Text style={styles.lbListName}>{user.name}</Text>
                   <Text style={styles.lbListUser}>{user.username}</Text>
                 </View>
               </View>
               <View style={styles.lbListRight}>
                 <Text style={styles.lbListPoints}>{user.points}</Text>
                 <Ionicons 
                   name={user.trend === 'up' ? "caret-up" : "caret-down"} 
                   size={14} 
                   color={user.trend === 'up' ? "#22C55E" : "#EF4444"} 
                 />
               </View>
             </View>
           ))}
           <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  backBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFF" },
  
  scrollContent: { paddingTop: 20 },

  lbTabsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, backgroundColor: '#1E293B', borderRadius: 12, marginHorizontal: 40, padding: 4 },
  lbTabActive: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  lbTabIndicator: { position: 'absolute', bottom: 0, width: 40, height: 3, backgroundColor: '#3B82F6', borderRadius: 2 },
  lbTabTextActive: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  lbTab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  lbTabText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },

  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 40, gap: 10 },
  podiumItem: { alignItems: 'center', width: '30%' },
  
  crownIcon: { marginBottom: -12, zIndex: 2 },
  avatarWrap1: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#FBBF24', padding: 4, backgroundColor: '#0F172A', marginBottom: 16, alignItems: 'center' },
  podiumAvatar1: { width: '100%', height: '100%', borderRadius: 40 },
  rankBadge1: { position: 'absolute', bottom: -12, backgroundColor: '#FBBF24', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0F172A' },
  
  avatarWrap2: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#0EA5E9', padding: 3, backgroundColor: '#0F172A', marginBottom: 12, alignItems: 'center' },
  podiumAvatar2: { width: '100%', height: '100%', borderRadius: 30 },
  rankBadge2: { position: 'absolute', bottom: -12, backgroundColor: '#0EA5E9', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0F172A' },

  avatarWrap3: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#22C55E', padding: 3, backgroundColor: '#0F172A', marginBottom: 12, alignItems: 'center' },
  podiumAvatar3: { width: '100%', height: '100%', borderRadius: 30 },
  rankBadge3: { position: 'absolute', bottom: -12, backgroundColor: '#22C55E', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0F172A' },

  rankBadgeText: { color: '#0F172A', fontSize: 12, fontWeight: '900' },
  
  podiumName: { color: '#F1F5F9', fontSize: 13, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  podiumUser: { color: '#64748B', fontSize: 10, fontWeight: '600', textAlign: 'center' },
  
  podiumPoints1: { color: '#FBBF24', fontSize: 18, fontWeight: '900', marginBottom: 2 },
  podiumPoints2: { color: '#0EA5E9', fontSize: 16, fontWeight: '900', marginBottom: 2 },
  podiumPoints3: { color: '#22C55E', fontSize: 16, fontWeight: '900', marginBottom: 2 },

  lbListContainer: { 
    backgroundColor: '#1E293B', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    paddingHorizontal: 24, 
    paddingTop: 30,
    borderTopWidth: 3,
    borderColor: '#0EA5E9',
    minHeight: 500,
  },
  lbListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  lbListLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  lbListAvatar: { width: 48, height: 48, borderRadius: 24 },
  lbListName: { color: '#F1F5F9', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  lbListUser: { color: '#64748B', fontSize: 12, fontWeight: '500' },
  lbListRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lbListPoints: { color: '#F1F5F9', fontSize: 16, fontWeight: '800' },
});
