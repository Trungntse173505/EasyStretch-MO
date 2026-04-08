import { useLeaderboard } from "@/hooks/auth/useLeaderboard";
import { useUser } from "@/hooks/auth/useUser";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LeaderboardScreen() {
  const router = useRouter();
  const { user: currentUser } = useUser();

  const { data: leaderboardData, loading } = useLeaderboard();

  // Sort and map API data
  const processedData = [...(leaderboardData || [])]
    .sort((a, b) => (b.current_point || 0) - (a.current_point || 0))
    .map((user, index) => {
      // API có thể trả về id, user_id, userId hoặc _id. Fix cứng kiểm tra tất cả:
      const rawId = user.id || (user as any).user_id || (user as any).userId || (user as any)._id;
      const parsedId = rawId !== undefined ? String(rawId) : String(index);

      return {
        id: parsedId,
        name: user.full_name || "Khách",
        username: user.full_name ? `@${user.full_name.replace(/\s+/g, '')}` : "@user",
        points: user.current_point || 0,
        rank: index + 1,
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || "Khách")}&background=random&color=fff&size=150`,
        trend: 'up',
        isMe: Boolean(currentUser?.id) && parsedId === String(currentUser?.id)
      };
    });

  const myRankIndex = processedData.findIndex(u => u.isMe);
  
  let myData = null;
  let isOutsideTop10 = false;

  if (myRankIndex !== -1) {
    isOutsideTop10 = myRankIndex >= 10;
    myData = processedData[myRankIndex];
  } else if (currentUser) {
    // If user is completely missing from the API response (e.g., 0 points)
    // we still try to show them at the bottom with "-" rank
    isOutsideTop10 = true;
    myData = {
      id: currentUser.id,
      name: currentUser.full_name || "Bạn",
      username: currentUser.full_name ? `@${currentUser.full_name.replace(/\\s+/g, '')}` : "@user",
      points: 0,
      rank: "-",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || "Bạn")}&background=random&color=fff&size=150`,
      trend: 'up',
      isMe: true
    };
  }
  
  const top10Data = processedData.slice(0, 10);

  // Ensure at least 3 elements for the podium to prevent crashes
  while (processedData.length < 3) {
    processedData.push({
      id: `dummy-${processedData.length}`,
      name: "-",
      username: "-",
      points: 0,
      rank: processedData.length + 1,
      avatar: `https://ui-avatars.com/api/?name=-&background=cccccc&color=fff&size=150`,
      trend: 'up',
      isMe: false
    });
  }

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
        {/* Podium */}
        <View style={styles.podiumContainer}>
          {/* Rank 2 */}
          <View style={[styles.podiumItem, { marginTop: 40 }]}>
            <View style={styles.avatarWrap2}>
              <Image source={{ uri: processedData[1].avatar }} style={styles.podiumAvatar2} />
              <View style={styles.rankBadge2}>
                <Text style={styles.rankBadgeText}>2</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, processedData[1].isMe && { color: '#0EA5E9' }]}>{processedData[1].name} {processedData[1].isMe ? "\n(Bạn)" : ""}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={[styles.podiumPoints2, { marginBottom: 0 }]}>{processedData[1].points}</Text>
            </View>
            <Text style={styles.podiumUser}>{processedData[1].username}</Text>
          </View>

          {/* Rank 1 */}
          <View style={[styles.podiumItem, { zIndex: 10 }]}>
            <MaterialCommunityIcons name="crown" size={36} color="#FBBF24" style={styles.crownIcon} />
            <View style={styles.avatarWrap1}>
              <Image source={{ uri: processedData[0].avatar }} style={styles.podiumAvatar1} />
              <View style={styles.rankBadge1}>
                <Text style={styles.rankBadgeText}>1</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, processedData[0].isMe && { color: '#0EA5E9' }]}>{processedData[0].name} {processedData[0].isMe ? "\n(Bạn)" : ""}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={[styles.podiumPoints1, { marginBottom: 0 }]}>{processedData[0].points}</Text>
            </View>
            <Text style={styles.podiumUser}>{processedData[0].username}</Text>
          </View>

          {/* Rank 3 */}
          <View style={[styles.podiumItem, { marginTop: 50 }]}>
            <View style={styles.avatarWrap3}>
              <Image source={{ uri: processedData[2].avatar }} style={styles.podiumAvatar3} />
              <View style={styles.rankBadge3}>
                <Text style={styles.rankBadgeText}>3</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, processedData[2].isMe && { color: '#0EA5E9' }]}>{processedData[2].name} {processedData[2].isMe ? "\n(Bạn)" : ""}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={[styles.podiumPoints3, { marginBottom: 0 }]}>{processedData[2].points}</Text>
            </View>
            <Text style={styles.podiumUser}>{processedData[2].username}</Text>
          </View>
        </View>

        {/* List rest */}
        <View style={styles.lbListContainer}>
          {top10Data.slice(3).map(user => (
            <View key={user.id} style={[styles.lbListItem, user.isMe && styles.lbListItemMe]}>
              <View style={styles.lbListLeft}>
                <Text style={[styles.lbListRank, user.isMe && { color: '#0EA5E9' }]}>{user.rank}</Text>
                <Image source={{ uri: user.avatar }} style={styles.lbListAvatar} />
                <View>
                  <Text style={[styles.lbListName, user.isMe && { color: '#0EA5E9' }]}>{user.name} {user.isMe && "(Bạn)"}</Text>
                  <Text style={styles.lbListUser}>{user.username}</Text>
                </View>
              </View>
              <View style={styles.lbListRight}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.lbListPoints}>{user.points}</Text>
                </View>
                <Ionicons
                  name={user.trend === 'up' ? "caret-up" : "caret-down"}
                  size={14}
                  color={user.trend === 'up' ? "#22C55E" : "#EF4444"}
                />
              </View>
            </View>
          ))}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Sticky footer for outside Top 10 */}
      {isOutsideTop10 && myData && (
        <View style={styles.stickyFooterContainer}>
          <View style={styles.stickyFooterInner}>
            <View style={styles.lbListLeft}>
              <Text style={[styles.lbListRank, { color: '#0EA5E9' }]}>{myData.rank}</Text>
              <Image source={{ uri: myData.avatar }} style={styles.lbListAvatar} />
              <View>
                <Text style={[styles.lbListName, { color: '#0EA5E9' }]}>{myData.name} (Bạn)</Text>
                <Text style={styles.lbListUser}>{myData.username}</Text>
              </View>
            </View>
            <View style={styles.lbListRight}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.lbListPoints, { color: '#0EA5E9' }]}>{myData.points}</Text>
              </View>
              <Ionicons
                name={myData.trend === 'up' ? "caret-up" : "caret-down"}
                size={14}
                color={myData.trend === 'up' ? "#22C55E" : "#EF4444"}
              />
            </View>
          </View>
        </View>
      )}
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

  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 40, gap: 10, marginTop: 20 },
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
  lbListItemMe: { backgroundColor: 'rgba(14, 165, 233, 0.15)', borderRadius: 12, paddingHorizontal: 12, marginHorizontal: -12, borderBottomWidth: 0 },
  lbListLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  lbListRank: { color: '#94A3B8', fontSize: 16, fontWeight: '800', width: 24, textAlign: 'center' },
  lbListAvatar: { width: 48, height: 48, borderRadius: 24 },
  lbListName: { color: '#F1F5F9', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  lbListUser: { color: '#64748B', fontSize: 12, fontWeight: '500' },
  lbListRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lbListPoints: { color: '#F1F5F9', fontSize: 16, fontWeight: '800' },

  stickyFooterContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 30, paddingTop: 10, paddingHorizontal: 20, backgroundColor: 'rgba(15, 23, 42, 0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  stickyFooterInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#0EA5E9' }
});
