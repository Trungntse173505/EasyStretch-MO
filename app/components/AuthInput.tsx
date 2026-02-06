import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  leftIcon: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  error?: string;       
  showError?: boolean;
  secure?: boolean;     
  onBlur?: () => void;
};

export default function AuthInput({
  label,
  value,
  onChangeText,
  leftIcon,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  editable = true,
  error = "",
  showError = false,
  secure = false,
  onBlur,
}: Props) {
  const [show, setShow] = useState(false);
  const hasError = !!error && showError;

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, hasError ? styles.inputWrapError : null]}>
        <Ionicons name={leftIcon} size={18} color="#555" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.input}
          placeholderTextColor="#9aa0a6"
          editable={editable}
          secureTextEntry={secure ? !show : false}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShow((s) => !s)} hitSlop={10} disabled={!editable}>
            <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={18} color="#555" />
          </TouchableOpacity>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 14, marginBottom: 8, color: "#111", fontWeight: "600" },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: "#fff",
  },
  inputWrapError: { borderColor: "#ff6b6b" },
  input: { flex: 1, color: "#111" },

  errorText: { color: "#ff3b30", marginTop: 6, fontSize: 12 },
});
