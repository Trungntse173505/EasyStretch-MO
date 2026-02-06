import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  View
} from "react-native";

export default function WelcomeSreen() {
  const router = useRouter();

  useEffect(() =>{
    const timer = setTimeout(() =>{
      router.replace("/(auth)/welcome");
    },3000);
    return () => clearTimeout(timer);
  },[router]);

  return (
    <ImageBackground
      source={require("../assets/images/Splash_Screen.png")}
      style={styles.container}
      resizeMode="cover"
      imageStyle={styles.bgImage} 
    >
      <View style={styles.contentContainer} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: {
    transform: [{ scale: 1.06 }],
  },

  contentContainer: {
    flex: 1,
  }
});
