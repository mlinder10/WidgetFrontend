import React from "react";
import Number from "./Number";

export default function Benchmark({ values, settings }) {
  function current() {
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

  function color() {
    const increasing = settings.benchmarkDirection === "increasing";
    try {
      const target = parseInt(settings.benchmarkValue);
      if (increasing) {
        if (current() >= target) return "#0f0";
        else return "#f00";
      }
      if (current() > target) return "#f00";
      else return "#0f0";
    } catch {
      return "initial";
    }
  }

  return (
    <div>
      <Number style={{ color: color() }} values={values} settings={settings} />
    </div>
  );
}
