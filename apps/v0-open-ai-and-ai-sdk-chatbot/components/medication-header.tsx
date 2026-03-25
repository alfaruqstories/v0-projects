import Link from "next/link"
import { Search, ShoppingBag, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MedicationHeader() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#0066FF]" />
            <span className="font-medium">Finder by Famasi</span>
          </Link>

          <div className="flex items-center space-x-4">
            <select
              defaultValue="Nigeria"
              className="bg-transparent border-none focus:ring-0 text-gray-900 rounded-full"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="Qatar">Qatar</option>
              <option value="Uganda">Uganda</option>
              <option value="Rwanda">Rwanda</option>
            </select>

            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-gray-100">
              <Moon className="h-[18px] w-[18px] text-gray-600" />
            </Button>

            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 rounded-full">
              Login
            </Button>

            <Button className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-full px-5">Create an account</Button>
          </div>
        </div>
      </div>
    </header>
  )
}

