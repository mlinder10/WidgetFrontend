import React from "react";

export default function Goal({ values, settings }) {
  function getGoal() {
    try {
      if (isNaN(parseInt(settings.goal))) return 0;
      return parseInt(settings.goal);
    } catch {
      return 0;
    }
  }

  function percentage() {
    try {
      const goal = getGoal();
      if (goal === 0) return 1;
      return current() / goal > 1
        ? 1
        : Math.round((current() / goal) * 100) / 100;
    } catch {
      return 1;
    }
  }

  function current() {
    return values[settings.function]
  }

  function width() {
    return percentage() * 80;
  }

  function color() {
    try {
      return `hsl(${Math.floor(125 * percentage())}, 100%, 50%)`;
    } catch {
      return "green";
    }
  }

  return (
    <div className="goal-root">
      <div className="goal-info">
        <p className="goal-current">{current()}</p>
        <p className="goal-goal"> / {getGoal()}</p>
      </div>
      <div className="goal-outline">
        <div
          className="goal-fill"
          style={{ backgroundColor: color(), width: `${width()}vw` }}
        >
          <div className="goal-arrow" />
        </div>
      </div>
    </div>
  );
}
