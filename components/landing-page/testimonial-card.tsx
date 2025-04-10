
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import Image from "next/image"

export function TestimonialCard({ name, role, quote, imageSrc }) {
    return (
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full">
              <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
          <div className="relative">
            <svg
              className="absolute -left-2 -top-2 h-8 w-8 text-primary/20"
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="relative text-lg text-muted-foreground">"{quote}"</p>
          </div>
        </CardContent>
      </Card>
    )
  }