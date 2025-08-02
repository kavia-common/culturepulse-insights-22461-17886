import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/MoodHeatmap.css";

/**
 * D3 Heatmap, mapping dates & users to mood scores.
 * Input: list of mood entries { user, mood, date }
 * Color palette: purple-accent gradient.
 */
const MoodHeatmap = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Prepare data: Map (user, date) to mood value
    const users = Array.from(new Set(data.map((d) => d.user_name)));
    const days = Array.from(
      new Set(data.map((d) => d.created_at.slice(0, 10)))
    ).sort();

    // Grid: users on Y, dates on X
    const gridData = [];
    users.forEach((user, i) => {
      days.forEach((date, j) => {
        const entry = data.find(
          (d) => d.user_name === user && d.created_at.startsWith(date)
        );
        gridData.push({
          x: j,
          y: i,
          mood: entry ? entry.mood : null,
          user,
          date,
        });
      });
    });

    // D3 render
    const width = 340,
      height = 46 + users.length * 32,
      cellSize = 30;

    // Purge SVG
    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    // Color: mood-to-gradient (custom: 1-5)
    const color = d3
      .scaleLinear()
      .domain([1, 5])
      .range(["#d8b4fe", "#7c3aed"]);

    svg
      .selectAll("rect")
      .data(gridData)
      .enter()
      .append("rect")
      .attr("x", (d) => 80 + d.x * cellSize)
      .attr("y", (d) => 40 + d.y * cellSize)
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d) =>
        d.mood === null ? "#eee" : color(d.mood)
      )
      .attr("rx", 7)
      .attr("ry", 7)
      .append("title")
      .text((d) => d.user + " - " + d.date + ": " + (d.mood ?? "No entry"));

    // User labels
    svg
      .selectAll("userlabels")
      .data(users)
      .enter()
      .append("text")
      .attr("x", 5)
      .attr("y", (d, i) => 56 + i * cellSize)
      .text((d) => d)
      .attr("font-size", "14px")
      .attr("fill", "#7c3aed");

    // Date labels
    svg
      .selectAll("datelabels")
      .data(days)
      .enter()
      .append("text")
      .attr("x", (d, j) => 80 + j * cellSize + 6)
      .attr("y", 28)
      .text((d) => d.slice(5))
      .attr("transform", null)
      .attr("font-size", "12px")
      .attr("fill", "#b983f6");

    // Border
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("rx", 24)
      .attr("ry", 24)
      .attr("fill", "none")
      .attr("stroke", "#d8b4fe")
      .attr("stroke-width", 2);

  }, [data]);

  return (
    <div className="mood-heatmap">
      <svg ref={ref}></svg>
    </div>
  );
};

export default MoodHeatmap;
