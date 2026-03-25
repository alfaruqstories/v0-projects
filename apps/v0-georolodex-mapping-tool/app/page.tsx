import type { Metadata } from "next"
import { StakeholderVisualization } from "@/components/stakeholder-visualization"

export const metadata: Metadata = {
  title: "GeoRolodex - Stakeholder Visualization",
  description: "An innovative 3D visualization tool for mapping stakeholder relationships",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <StakeholderVisualization />
    </div>
  )
}

