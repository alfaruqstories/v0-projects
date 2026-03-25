import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, MapPin } from "lucide-react"

export function PharmacyList() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-bold text-[#000B20]">Find the best deals</h2>
        <p className="text-2xl text-gray-600">
          This is where we will put subtext for the section below. Something sweet and short
        </p>
      </div>

      <Card className="bg-orange-50 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <MapPin className="text-amber-500" />
            <span className="text-amber-500">
              Showing pharmacies around <strong>Lekki, Ajah</strong>
            </span>
            <Button variant="link" className="text-amber-300">
              Change
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-500">Sorted by:</span>
            <Button variant="outline" className="text-amber-400 bg-white border-orange-100 rounded-full">
              Highest fulfillment rate
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {pharmacies.map((pharmacy, index) => (
            <PharmacyCard key={index} {...pharmacy} />
          ))}
        </div>
      </Card>
    </section>
  )
}

function PharmacyCard({
  name,
  location,
  price,
}: {
  name?: string
  location: string
  price: string
}) {
  return (
    <div className="bg-white p-5 rounded-lg flex justify-between items-center">
      <div>
        {name && <div className="font-medium mb-1">{name}</div>}
        <div className="text-gray-600">{location}</div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-amber-400">{price}</span>
        <Button variant="link" className="text-amber-500 underline rounded-full">
          Add to cart
        </Button>
      </div>
    </div>
  )
}

const pharmacies = [
  { location: "Lekki, Lagos", price: "₦1,918.00" },
  { name: "Rev. Dagogo Jack Pharmacy", location: "Lekki, Lagos", price: "₦1,918.00" },
  { location: "Ajah, Lagos", price: "₦1,918.00" },
]

