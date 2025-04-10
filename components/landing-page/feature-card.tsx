export function FeatureCard({ icon, title, description, color }) {
    return (
      <div className="group relative overflow-hidden rounded-xl bg-background p-8 shadow-md transition-all hover:shadow-lg">
        <div
          className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform rounded-full ${color} opacity-10 blur-2xl transition-all group-hover:opacity-20`}
        ></div>
        <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${color} text-white`}>{icon}</div>
        <h3 className="mb-3 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    )
  }