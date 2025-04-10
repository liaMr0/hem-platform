
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"



export function ResourceCard({ icon, title, description, category }) {
    return (
      <Card className="group h-full overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-4">
          <div className="mb-2">
            <Badge variant="outline" className="bg-primary/5 text-primary">
              {category}
            </Badge>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-primary">
            <span>Explorar recurso</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </CardContent>
      </Card>
    )
  }
  