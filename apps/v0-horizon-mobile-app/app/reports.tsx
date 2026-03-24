"use client"

import { useState, useEffect } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useRouter } from "expo-router"
import { BarChart, LineChart, PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { Download, ChevronDown, Filter } from "lucide-react-native"
import { fetchReportData } from "@/lib/api"

const screenWidth = Dimensions.get("window").width

export default function Reports() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("week")
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true)
      try {
        const data = await fetchReportData(timeframe)
        setReportData(data)
      } catch (error) {
        console.error("Failed to fetch report data:", error)
        Alert.alert("Error", "Failed to load report data")
      } finally {
        setLoading(false)
      }
    }

    loadReportData()
  }, [timeframe])

  const handleExport = () => {
    Alert.alert("Export Report", "Choose export format", [
      { text: "PDF", onPress: () => console.log("Export as PDF") },
      { text: "Email", onPress: () => console.log("Send via Email") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading report data...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Performance Reports</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Download size={16} color="#fff" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.timeframeSelector}>
          <Text style={styles.filterLabel}>Timeframe:</Text>
          <TouchableOpacity style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>
              {timeframe === "week" ? "This Week" : timeframe === "month" ? "This Month" : "This Quarter"}
            </Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#666" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>42</Text>
            <Text style={styles.summaryLabel}>Total Interactions</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>8</Text>
            <Text style={styles.summaryLabel}>New Clients</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>$24.5k</Text>
            <Text style={styles.summaryLabel}>Deals Closed</Text>
          </View>
        </View>

        {/* Interactions by Type Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Interactions by Type</Text>
          <PieChart
            data={[
              {
                name: "Calls",
                population: 21,
                color: "#0066cc",
                legendFontColor: "#666",
                legendFontSize: 12,
              },
              {
                name: "Emails",
                population: 15,
                color: "#00cc99",
                legendFontColor: "#666",
                legendFontSize: 12,
              },
              {
                name: "Meetings",
                population: 6,
                color: "#ff9933",
                legendFontColor: "#666",
                legendFontSize: 12,
              },
            ]}
            width={screenWidth - 32}
            height={180}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Daily Activity Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Activity</Text>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              datasets: [
                {
                  data: [5, 8, 6, 9, 14],
                  color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#0066cc",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Client Engagement Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Client Engagement</Text>
          <BarChart
            data={{
              labels: ["High", "Medium", "Low"],
              datasets: [
                {
                  data: [18, 14, 10],
                },
              ],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.5,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066cc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  exportButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 4,
  },
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  timeframeSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#333",
    marginRight: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
})

