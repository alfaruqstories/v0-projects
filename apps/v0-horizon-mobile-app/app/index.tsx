"use client"

import { useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"
import { Search, Bell, Menu } from "lucide-react-native"
import ClientList from "@/components/client-list"
import FilterBar from "@/components/filter-bar"
import { fetchClients } from "@/lib/api"
import type { Client } from "@/types"

export default function Home() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients()
        setClients(data)
        setFilteredClients(data)
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  useEffect(() => {
    let result = clients

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.company.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (filter !== "all") {
      result = result.filter((client) => client.priority === filter)
    }

    setFilteredClients(result)
  }, [searchQuery, filter, clients])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/menu")}>
          <Menu size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Client Dashboard</Text>
        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <Bell size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TouchableOpacity style={styles.searchInput} onPress={() => router.push("/search")}>
            <Text style={styles.searchPlaceholder}>Search clients...</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Bar */}
      <FilterBar currentFilter={filter} onFilterChange={handleFilterChange} />

      {/* Client List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading clients...</Text>
        </View>
      ) : (
        <ClientList clients={filteredClients} onClientPress={(client) => router.push(`/client/${client.id}`)} />
      )}

      {/* Add Client FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add-client")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  searchPlaceholder: {
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
  },
})

