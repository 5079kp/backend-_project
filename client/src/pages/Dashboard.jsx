import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function Dashboard() {
  const cards = useRef([])
  const [cols, setCols] = useState(4)

  // 🔁 Responsive columns logic
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth > 1024) setCols(4)
      else if (window.innerWidth > 768) setCols(2)
      else setCols(1)
    }

    updateCols()
    window.addEventListener("resize", updateCols)
    return () => window.removeEventListener("resize", updateCols)
  }, [])

  // 🎬 GSAP animation
  useEffect(() => {
    gsap.from(cards.current, {
      y: 80,
      opacity: 0,
      stagger: 0.2,
      duration: 1
    })
  }, [])

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1>⚡ System Dashboard</h1>
        <p>Real-time monitoring and analytics</p>
      </header>

      {/* STATS GRID */}
      <section
        style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${cols}, 1fr)`
        }}
      >
        {[
          { title: "Total Users", value: "1,284", color: "#38bdf8" },
          { title: "Revenue", value: "$12,450", color: "#22c55e" },
          { title: "Active Now", value: "42", color: "#facc15" },
          { title: "Server Status", value: "Online", color: "#a78bfa" }
        ].map((card, i) => (
          <div
            key={i}
            ref={el => (cards.current[i] = el)}
            style={{
              ...styles.card,
              borderColor: card.color
            }}
            onMouseEnter={e =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={e =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3>{card.title}</h3>
            <h2 style={{ color: card.color }}>{card.value}</h2>
          </div>
        ))}
      </section>
    </div>
  )
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    background: "radial-gradient(circle at top, #020617, #020617)",
    color: "white",
    padding: "40px",
    display: "flex",
    flexDirection: "column"
  },

  header: {
    marginBottom: "40px"
  },

  grid: {
    display: "grid",
    gap: "30px",
    flexGrow: 1
  },

  card: {
    border: "2px solid",
    borderRadius: "20px",
    padding: "30px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    transition: "0.3s",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer"
  }
}