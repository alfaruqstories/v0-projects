"use client"

import { MedicationHeader } from "@/components/medication-header"
import { MedicationInfo } from "@/components/medication-info"
import { SelectionFilters } from "@/components/selection-filters"
import { PharmacyList } from "@/components/pharmacy-list"
import { PriceHistory } from "@/components/price-history"
import { SavingsSection } from "@/components/savings-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function MedicationPage() {
  return (
    <div className="min-h-screen bg-white">
      <MedicationHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-[#FCB5B5]">Amlodipine Besylate</h1>
            <p className="text-2xl text-gray-600">(Generic Norvasc)</p>
          </div>

          {/* Image and Description Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg?height=332&width=459"
                alt="Amlodipine Besylate medication"
                className="rounded-[70px] bg-black w-full"
              />
            </div>
            <div className="md:w-1/2">
              <MedicationInfo />
            </div>
          </div>

          {/* Selection Filters */}
          <SelectionFilters />

          <PharmacyList />
          <PriceHistory />
          <SavingsSection />
          <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}

