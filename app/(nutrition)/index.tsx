import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const bgImage = require('../../assets/images/Nutrition.png');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Dinh dưỡng cá{'\n'}nhân hóa bắt đầu{'\n'}từ đây
          </Text>
        </View>
        

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(nutrition)/log')}>
          <Text style={styles.buttonText}>Khám phá</Text>
        </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)', 
    paddingHorizontal: 24, 
    paddingBottom: 50,
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center',
  },
  title: {
    fontSize: 40, 
    fontWeight: '800', 
    color: '#fff',
    textAlign: 'center', 
    lineHeight: 48, 
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%', 
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#111' 
  },
});