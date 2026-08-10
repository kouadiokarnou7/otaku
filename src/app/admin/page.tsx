import { BarChart3, Users, FileText, Shield } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Utilisateurs", value: "2,543", icon: Users, color: "#FF6B1A" },
    { label: "Posts", value: "8,234", icon: FileText, color: "#3498DB" },
    { label: "Modérations", value: "45", icon: Shield, color: "#E74C3C" },
    { label: "Vues", value: "128.5K", icon: BarChart3, color: "#2ECC71" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: "#fff" }}>
        Dashboard
      </h1>

      {/* Statistiques */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  background: stat.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={24} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contenu exemple */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
          Activité récente
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Les données d'activité seront affichées ici...
        </p>
      </div>
    </div>
  );
}
