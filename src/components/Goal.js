import React from "react";

export default function Goal({ values, boards, settings }) {
  function Percentage() {
    try {
      const goal = parseInt(settings.goal);
      return Current() / goal > 1 ? 1 : Current() > goal;
    } catch {
      return 0;
    }
  }

  function Current() {
    switch (settings.function) {
      case "sum":
        return values.sum;
      case "min":
        return values.min;
      case "max":
        return values.max;
      case "median":
        return values.median;
      case "average":
        return values.average;
      case "count":
        return values.count;
    }
  }

  function Width() {
    return Percentage() * 80;
  }

  function Color() {
    try {
      const color = `rgb(${Math.floor(255 - 255 * Percentage())}, ${Math.floor(
        255 * Percentage()
      )}, 0)`;
    } catch {
      return "blue";
    }
  }

  return (
    <div className="goal-root">
      <div className="goal-info">
        <p>{Current()}</p>
        <p>{settings.goal}</p>
      </div>
      <div className="goal-outline">
        <div
          className="goal-fill"
          style={{ backgroundColor: `green`, width: `${Width()}vw` }}
        ></div>
      </div>
    </div>
  );
}
