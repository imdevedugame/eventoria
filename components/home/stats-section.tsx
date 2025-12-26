export function StatsSection() {
  const stats = [
    { label: "Total Seminar", value: "500+", suffix: "Acara" },
    { label: "Peserta Terdaftar", value: "50,000+", suffix: "Orang" },
    { label: "Kategori Tersedia", value: "15+", suffix: "Topik" },
    { label: "Kota di Indonesia", value: "34", suffix: "Lokasi" },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-primary via-secondary to-accent">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-sm text-primary-foreground/80 font-medium">{stat.suffix}</p>
              <p className="text-xs text-primary-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
