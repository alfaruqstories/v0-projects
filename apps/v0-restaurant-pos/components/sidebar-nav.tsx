import { Menu, TableIcon as TableBar, CalendarRange, Truck, Calculator, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Menu, label: "Menu", active: true },
  { icon: TableBar, label: "Table Services", active: false },
  { icon: CalendarRange, label: "Reservation", active: false },
  { icon: Truck, label: "Delivery", active: false },
  { icon: Calculator, label: "Accounting", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function SidebarNav() {
  return (
    <div className="w-64 p-4 border-r h-screen bg-amber-900 text-white">
      <div className="flex items-center gap-2 mb-8">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg"
          alt="Chili POS Logo"
          className="w-8 h-8"
        />
        <span className="font-semibold text-white">CHILI POS</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start text-amber-100 hover:bg-amber-800 hover:text-white ${item.active ? "bg-amber-800 text-white font-medium" : ""}`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="w-full justify-start mt-auto text-amber-100 hover:bg-amber-800 hover:text-white absolute bottom-4"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}

