import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

// This would come from your database in a real application
const departments = [
  {
    id: "youth",
    name: "Youth Ministry",
    description: "Empowering young people to grow in faith and leadership.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "teen-youth",
    name: "Teen Youth",
    description: "Guiding teenagers through faith, fellowship, and fun activities.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "women",
    name: "Women's Fellowship",
    description: "Connecting women through prayer, study, and community service.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "men",
    name: "Men's Fellowship",
    description: "Building strong men of faith through discipleship and brotherhood.",
    image: "/placeholder.svg?height=300&width=500",
  },
]

export default function DepartmentCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {departments.map((department) => (
        <Link key={department.id} href={`/departments/${department.id}`}>
          <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02]">
            <div className="relative h-48">
              <Image src={department.image || "/placeholder.svg"} alt={department.name} fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{department.name}</h3>
              <p className="text-muted-foreground">{department.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

