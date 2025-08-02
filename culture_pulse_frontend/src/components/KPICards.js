import React from "react";
import "../styles/KPICards.css";

/**
 * Card-based KPIs: mood average, stddev, participation.
 * Props: { avg, stddev, participation } in kpis
 */
const KPICards = ({ kpis, accent }) => {
  const items = [
    {
      title: "Average Mood",
      value: kpis.avg?.toFixed?.(2) ?? "--",
      icon: "😊",
      color: "linear-gradient(90deg, #d8b4fe, #7c3aed)",
    },
    {
      title: "Std Dev",
      value: kpis.stddev?.toFixed?.(2) ?? "--",
      icon: "📈",
      color: "linear-gradient(90deg, #e0c3fc, #f472b6)",
    },
    {
      title: "Participation",
      value: kpis.participation_rate
        ? `${(kpis.participation_rate * 100).toFixed(1)}%`
        : "--",
      icon: "🗳️",
      color: "linear-gradient(90deg, #f472b6, #7c3aed)",
    },
  ];

  return (
    <div className="kpi-cards-row">
      {items.map((item, ix) => (
        <div className="kpi-card" key={ix} style={{ background: item.color }}>
          <span className="kpi-icon">{item.icon}</span>
          <div className="kpi-details">
            <span className="kpi-title">{item.title}</span>
            <span className="kpi-value">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
