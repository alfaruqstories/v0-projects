"use client"
import { useState, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Eye, EyeOff, RotateCcw, Users, MessageSquare, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type * as THREE from "three"

interface Building3D {
  id: string
  type: "residential" | "commercial" | "industrial" | "landmark" | "park" | "road"
  position: [number, number, number]
  scale: [number, number, number]
  color: string
  name: string
  style: "modern" | "classic" | "futuristic" | "eco"
}

interface CityMap3D {
  id: string
  name: string
  description: string
  buildings: Building3D[]
  creator: string
  createdAt: Date
  theme: string
}

const SAMPLE_MAPS: CityMap3D[] = [
  {
    id: "1",
    name: "Neo Singapore",
    description: "Vertical city with integrated nature and smart technology",
    creator: "FutureArchitect",
    createdAt: new Date("2024-01-15"),
    theme: "futuristic",
    buildings: [
      {
        id: "1",
        type: "landmark",
        position: [0, 10, 0],
        scale: [3, 20, 3],
        color: "#f59e0b",
        name: "Sky Garden Tower",
        style: "futuristic",
      },
      {
        id: "2",
        type: "residential",
        position: [-5, 7.5, -3],
        scale: [2, 15, 2],
        color: "#10b981",
        name: "Vertical Village",
        style: "eco",
      },
      {
        id: "3",
        type: "commercial",
        position: [6, 5, 2],
        scale: [2.5, 10, 2.5],
        color: "#3b82f6",
        name: "Tech Hub",
        style: "modern",
      },
    ],
  },
  {
    id: "2",
    name: "Coastal Haven",
    description: "Sustainable waterfront community with renewable energy",
    creator: "EcoPlanner",
    createdAt: new Date("2024-01-20"),
    theme: "sustainable",
    buildings: [
      {
        id: "1",
        type: "park",
        position: [0, 0.5, 0],
        scale: [8, 1, 6],
        color: "#22c55e",
        name: "Waterfront Park",
        style: "eco",
      },
      {
        id: "2",
        type: "residential",
        position: [-4, 6, -2],
        scale: [1.8, 12, 1.8],
        color: "#10b981",
        name: "Solar Apartments",
        style: "eco",
      },
    ],
  },
]

const parseNaturalLanguageCommand = (command: string) => {
  const lowerCommand = command.toLowerCase()

  // Building type detection
  let type: Building3D["type"] = "residential"
  if (lowerCommand.includes("skyscraper") || lowerCommand.includes("tower") || lowerCommand.includes("office")) {
    type = "commercial"
  } else if (lowerCommand.includes("house") || lowerCommand.includes("apartment") || lowerCommand.includes("home")) {
    type = "residential"
  } else if (
    lowerCommand.includes("factory") ||
    lowerCommand.includes("warehouse") ||
    lowerCommand.includes("industrial")
  ) {
    type = "industrial"
  } else if (lowerCommand.includes("park") || lowerCommand.includes("garden") || lowerCommand.includes("green")) {
    type = "park"
  } else if (
    lowerCommand.includes("monument") ||
    lowerCommand.includes("landmark") ||
    lowerCommand.includes("city hall")
  ) {
    type = "landmark"
  } else if (lowerCommand.includes("road") || lowerCommand.includes("street") || lowerCommand.includes("avenue")) {
    type = "road"
  }

  // Style detection
  let style: Building3D["style"] = "modern"
  if (lowerCommand.includes("futuristic") || lowerCommand.includes("cyber") || lowerCommand.includes("tech")) {
    style = "futuristic"
  } else if (
    lowerCommand.includes("classic") ||
    lowerCommand.includes("traditional") ||
    lowerCommand.includes("historic")
  ) {
    style = "classic"
  } else if (lowerCommand.includes("eco") || lowerCommand.includes("green") || lowerCommand.includes("sustainable")) {
    style = "eco"
  }

  // Size and height detection
  let height = 5
  let width = 2
  let depth = 2

  if (lowerCommand.includes("small") || lowerCommand.includes("tiny")) {
    height *= 0.6
    width *= 0.8
    depth *= 0.8
  } else if (lowerCommand.includes("large") || lowerCommand.includes("big") || lowerCommand.includes("huge")) {
    height *= 1.5
    width *= 1.3
    depth *= 1.3
  } else if (lowerCommand.includes("tall") || lowerCommand.includes("high") || lowerCommand.includes("skyscraper")) {
    height *= 2.5
  }

  // Special handling for different types
  if (type === "park") {
    height = 1
    width = 6 + Math.random() * 4
    depth = 4 + Math.random() * 3
  } else if (type === "road") {
    height = 0.1
    width = 8 + Math.random() * 4
    depth = 2
  } else if (type === "landmark") {
    height *= 1.8
    width *= 1.2
    depth *= 1.2
  }

  return { type, style, height, width, depth }
}

const generateBuildingFromCommand = (command: string, position: [number, number, number]): Building3D => {
  const parsed = parseNaturalLanguageCommand(command)

  const colors = {
    residential: ["#10b981", "#059669", "#047857"],
    commercial: ["#3b82f6", "#2563eb", "#1d4ed8"],
    industrial: ["#6b7280", "#4b5563", "#374151"],
    landmark: ["#f59e0b", "#d97706", "#b45309"],
    park: ["#22c55e", "#16a34a", "#15803d"],
    road: ["#64748b", "#475569", "#334155"],
  }

  const names = {
    residential: ["Apartment Complex", "Housing Tower", "Residential Block", "Living Quarters"],
    commercial: ["Office Building", "Shopping Center", "Business Tower", "Commercial Plaza"],
    industrial: ["Factory", "Warehouse", "Manufacturing Plant", "Industrial Complex"],
    landmark: ["City Hall", "Monument", "Cultural Center", "Landmark Tower"],
    park: ["Central Park", "Green Space", "Community Garden", "Recreation Area"],
    road: ["Main Street", "Avenue", "Boulevard", "Highway"],
  }

  const color = colors[parsed.type][Math.floor(Math.random() * colors[parsed.type].length)]
  const name = names[parsed.type][Math.floor(Math.random() * names[parsed.type].length)]

  return {
    id: Date.now().toString(),
    type: parsed.type,
    position: [position[0], parsed.height / 2, position[2]],
    scale: [parsed.width, parsed.height, parsed.depth],
    color,
    name,
    style: parsed.style,
  }
}

// 3D Building Component
function Building3DComponent({ building, onClick }: { building: Building3D; onClick?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current && building.style === "futuristic") {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  const getGeometry = () => {
    switch (building.type) {
      case "park":
        return <cylinderGeometry args={[building.scale[0] / 2, building.scale[0] / 2, building.scale[1], 8]} />
      case "road":
        return <boxGeometry args={building.scale} />
      default:
        return <boxGeometry args={building.scale} />
    }
  }

  const getMaterial = () => {
    const baseColor = building.color

    if (building.style === "futuristic") {
      return (
        <meshStandardMaterial
          color={baseColor}
          metalness={0.8}
          roughness={0.2}
          emissive={baseColor}
          emissiveIntensity={0.1}
        />
      )
    } else if (building.style === "eco") {
      return <meshLambertMaterial color={baseColor} />
    } else if (building.style === "classic") {
      return <meshPhongMaterial color={baseColor} shininess={30} />
    } else {
      return <meshStandardMaterial color={baseColor} metalness={0.3} roughness={0.7} />
    }
  }

  return (
    <group position={building.position}>
      <mesh ref={meshRef} onClick={onClick} castShadow receiveShadow>
        {getGeometry()}
        {getMaterial()}
      </mesh>

      {/* Building windows for non-park buildings */}
      {building.type !== "park" && building.type !== "road" && (
        <>
          {/* Front face windows */}
          {Array.from({ length: Math.floor(building.scale[1] / 2) }, (_, floor) =>
            Array.from({ length: Math.floor(building.scale[0] / 1.5) }, (_, col) => (
              <mesh
                key={`window-${floor}-${col}`}
                position={[
                  (col - Math.floor(building.scale[0] / 1.5) / 2) * 1.2,
                  (floor - building.scale[1] / 2) * 1.8 + 1,
                  building.scale[2] / 2 + 0.01,
                ]}
              >
                <planeGeometry args={[0.3, 0.4]} />
                <meshBasicMaterial color="#87ceeb" transparent opacity={0.8} />
              </mesh>
            )),
          )}
        </>
      )}

      {/* Eco features for eco buildings */}
      {building.style === "eco" && building.type !== "park" && (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <mesh
              key={`plant-${i}`}
              position={[
                (Math.random() - 0.5) * building.scale[0] * 0.8,
                building.scale[1] / 2 + 0.2,
                (Math.random() - 0.5) * building.scale[2] * 0.8,
              ]}
            >
              <sphereGeometry args={[0.2, 8, 6]} />
              <meshLambertMaterial color="#22c55e" />
            </mesh>
          ))}
        </>
      )}

      {/* Building label */}
      <Html position={[0, building.scale[1] + 1, 0]} center>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
          {building.name}
        </div>
      </Html>
    </group>
  )
}

// Terrain/Ground Component
function Terrain({
  onGroundClick,
  isWaitingForClick,
}: { onGroundClick: (event: any) => void; isWaitingForClick: boolean }) {
  return (
    <group>
      {/* Clickable ground plane */}
      <mesh position={[0, -0.5, 0]} receiveShadow onClick={isWaitingForClick ? onGroundClick : undefined}>
        <boxGeometry args={[100, 1, 100]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>

      {/* Terrain texture overlay */}
      <mesh position={[0, -0.49, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#0f172a" transparent opacity={0.8} />
      </mesh>

      {/* Grid lines for city planning */}
      {Array.from({ length: 21 }, (_, i) => (
        <group key={`grid-${i}`}>
          <mesh position={[(i - 10) * 5, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, 100]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </mesh>
          <mesh position={[0, -0.48, (i - 10) * 5]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.1, 100]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </mesh>
        </group>
      ))}

      {/* Natural terrain features */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`terrain-${i}`}
          position={[(Math.random() - 0.5) * 80, -0.3, (Math.random() - 0.5) * 80]}
          receiveShadow
        >
          <cylinderGeometry args={[3 + Math.random() * 5, 3 + Math.random() * 5, 0.5, 8]} />
          <meshLambertMaterial color="#22c55e" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export default function InteractiveMapBuilder() {
  const [buildings, setBuildings] = useState<Building3D[]>([])
  const [command, setCommand] = useState("")
  const [cityName, setCityName] = useState("")
  const [cityDescription, setCityDescription] = useState("")
  const [showCommunityMaps, setShowCommunityMaps] = useState(false)
  const [communityMaps, setCommunityMaps] = useState<CityMap3D[]>(SAMPLE_MAPS)
  const [pendingCommand, setPendingCommand] = useState<string>("")
  const [isWaitingForClick, setIsWaitingForClick] = useState(false)

  const { toast } = useToast()

  const handleGroundClick = (event: any) => {
    if (!isWaitingForClick || !pendingCommand) return

    event.stopPropagation()

    const position: [number, number, number] = [event.point.x, 0, event.point.z]

    const newBuilding = generateBuildingFromCommand(pendingCommand, position)
    setBuildings((prev) => [...prev, newBuilding])
    setPendingCommand("")
    setIsWaitingForClick(false)
    setCommand("")

    toast({
      title: "Building Added!",
      description: `${newBuilding.name} has been placed on your map.`,
    })
  }

  const handleCommandSubmit = () => {
    if (!command.trim()) return

    setPendingCommand(command.trim())
    setIsWaitingForClick(true)

    toast({
      title: "Click to Place",
      description: "Click anywhere on the 3D map to place your building.",
    })
  }

  const generateCityFromPrompt = () => {
    if (!command.trim()) return

    const buildingCount = 5 + Math.floor(Math.random() * 8)
    const newBuildings: Building3D[] = []

    for (let i = 0; i < buildingCount; i++) {
      const x = (Math.random() - 0.5) * 40
      const z = (Math.random() - 0.5) * 40
      const building = generateBuildingFromCommand(command, [x, 0, z])
      newBuildings.push(building)
    }

    setBuildings(newBuildings)
    setCityName(`AI Generated: ${command.slice(0, 30)}${command.length > 30 ? "..." : ""}`)
    setCityDescription(`Generated from prompt: "${command}"`)
    setCommand("")

    toast({
      title: "City Generated!",
      description: `Created ${buildingCount} buildings from your prompt.`,
    })
  }

  const clearMap = () => {
    setBuildings([])
    setCityName("")
    setCityDescription("")
    setPendingCommand("")
    setIsWaitingForClick(false)
  }

  const loadCommunityMap = (map: CityMap3D) => {
    setBuildings(map.buildings)
    setCityName(map.name)
    setCityDescription(map.description)
    setShowCommunityMaps(false)
  }

  return (
    <div className="h-screen w-full bg-slate-900 flex">
      {/* Main 3D Map */}
      <div className="flex-1 relative">
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <h1 className="text-white font-bold text-lg">3D Interactive Map Builder</h1>
            </div>
            {cityName && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {cityName}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showCommunityMaps ? "default" : "secondary"}
              size="sm"
              onClick={() => setShowCommunityMaps(!showCommunityMaps)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              {showCommunityMaps ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              Community
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={clearMap}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Command Interface */}
        <div className="absolute top-20 left-4 right-4 z-10">
          <div className="flex gap-2 max-w-4xl">
            <div className="flex-1 relative">
              <Input
                placeholder={
                  isWaitingForClick
                    ? "Now click on the 3D map to place your building..."
                    : "Try: 'Add a tall glass skyscraper here' or 'Place a small eco-friendly park'"
                }
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="bg-black/20 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60"
                onKeyDown={(e) => e.key === "Enter" && (isWaitingForClick ? null : handleCommandSubmit())}
                disabled={isWaitingForClick}
              />
              {isWaitingForClick && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <Button
              onClick={handleCommandSubmit}
              disabled={!command.trim() || isWaitingForClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {isWaitingForClick ? "Click Map" : "Place"}
            </Button>
            <Button
              onClick={generateCityFromPrompt}
              disabled={!command.trim() || isWaitingForClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate City
            </Button>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ position: [20, 20, 20], fov: 60 }}
          className={`w-full h-full ${isWaitingForClick ? "cursor-crosshair" : "cursor-default"}`}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 20, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[0, 10, 0]} intensity={0.5} />

            {/* Environment */}
            <Environment preset="city" />

            {/* Terrain with click handler */}
            <Terrain onGroundClick={handleGroundClick} isWaitingForClick={isWaitingForClick} />

            {/* Buildings */}
            {buildings.map((building) => (
              <Building3DComponent key={building.id} building={building} />
            ))}

            {/* Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={100}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Suspense>
        </Canvas>

        {/* Instructions */}
        {buildings.length === 0 && !isWaitingForClick && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white/60">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Build Your Dream City in 3D</h2>
              <p className="text-lg mb-4">Use natural language to describe buildings and click to place them</p>
              <div className="text-sm space-y-1">
                <p>• "Add a tall glass skyscraper here"</p>
                <p>• "Place a small eco-friendly park"</p>
                <p>• "Build a futuristic landmark tower"</p>
              </div>
            </div>
          </div>
        )}

        {isWaitingForClick && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>
                Click anywhere on the 3D map to place: <strong>{pendingCommand}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Building Count */}
        {buildings.length > 0 && (
          <div className="absolute bottom-6 right-6">
            <Badge className="bg-black/80 text-white border-white/20">{buildings.length} Buildings</Badge>
          </div>
        )}

        {/* 3D Navigation Help */}
        <div className="absolute bottom-6 left-6">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white/70 text-xs">
            <div>🖱️ Drag to rotate • 🔍 Scroll to zoom • ⌨️ Shift+drag to pan</div>
          </div>
        </div>
      </div>

      {/* Community Maps Sidebar */}
      {showCommunityMaps && (
        <div className="w-96 bg-black/40 backdrop-blur-sm border-l border-white/20 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Community Cities</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCommunityMaps(false)}
              className="text-white hover:bg-white/10"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {communityMaps.map((map) => (
              <Card
                key={map.id}
                className="bg-white/10 border-white/20 p-4 cursor-pointer hover:bg-white/20 transition-all duration-200"
                onClick={() => loadCommunityMap(map)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg mb-1">{map.name}</h4>
                    <Badge variant="outline" className="text-xs border-white/30 text-white/70 mb-2">
                      {map.theme}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs border-white/30 text-white/70">
                    {map.buildings.length} buildings
                  </Badge>
                </div>

                <p className="text-white/80 text-sm mb-3 leading-relaxed">{map.description}</p>

                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="font-medium">by {map.creator}</span>
                  <span>{map.createdAt.toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-white/10">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Social Experiment
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              What would your ideal city look like? Use natural language to describe and build your vision of the future
              in immersive 3D.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
