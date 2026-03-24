"use client"

import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ArrowLeft, Phone, Mail, Calendar, Check } from "lucide-react-native"
import { logInteraction } from "@/lib/api"

export default function LogInteraction() {
  const { clientId, clientName, interactionType = "call" } = useLocalSearchParams()
  const router = useRouter()
  const [type, setType] = useState<"call" | "email" | "meeting">((interactionType as any) || "call")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!notes.trim()) {
      Alert.alert("Error", "Please enter interaction notes")
      return
    }

    setLoading(true)
    try {
      await logInteraction({
        clientId: clientId as string,
        type,
        notes,
        date: new Date().toISOString(),
      })

      Alert.alert("Success", "Interaction logged successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      console.error("Failed to log interaction:", error)
      Alert.alert("Error", "Failed to log interaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Interaction</Text>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <>
              <Check size={16} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Client Info */}
          <View style={styles.clientInfo}>
            <Text style={styles.clientLabel}>Client</Text>
            <Text style={styles.clientName}>{clientName}</Text>
          </View>

          {/* Interaction Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interaction Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[styles.typeButton, type === "call" && styles.activeTypeButton]}
                onPress={() => setType("call")}
              >
                <Phone size={20} color={type === "call" ? "#fff" : "#0066cc"} />
                <Text style={[styles.typeButtonText, type === "call" && styles.activeTypeButtonText]}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeButton, type === "email" && styles.activeTypeButton]}
                onPress={() => setType("email")}
              >
                <Mail size={20} color={type === "email" ? "#fff" : "#0066cc"} />
                <Text style={[styles.typeButtonText, type === "email" && styles.activeTypeButtonText]}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeButton, type === "meeting" && styles.activeTypeButton]}
                onPress={() => setType("meeting")}
              >
                <Calendar size={20} color={type === "meeting" ? "#fff" : "#0066cc"} />
                <Text style={[styles.typeButtonText, type === "meeting" && styles.activeTypeButtonText]}>Meeting</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Enter interaction details..."
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066cc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#b0bec5",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 4,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  clientInfo: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  clientLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeTypeButton: {
    backgroundColor: "#0066cc",
  },
  typeButtonText: {
    marginLeft: 8,
    color: "#0066cc",
    fontWeight: "500",
  },
  activeTypeButtonText: {
    color: "#fff",
  },
  notesInput: {
    height: 150,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
})

