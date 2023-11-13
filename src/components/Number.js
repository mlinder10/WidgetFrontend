import React from "react";

export default function Number({ values, boards, settings }) {
  function Value() {
    switch (settings.function) {
      case "sum":
        return values.sum
      case "min":
        return values.min
      case "max":
        return values.max
      case "count":
        return values.count
      case "average":
        return values.average
      case "median":
        return values.median
    }
  }

  function Units() {
    let unit = (settings?.unit === undefined) ? "" : settings.unit.symbol
    if (unit === "custom") unit = settings.unit.custom_unit
    return unit
  }

  return (
    <>
    {settings.unit.direction === "left" && <p>{`${Units()}${Value()}`}</p>}
    {settings.unit.direction === "right" && <p>{`${Value()}${Units()}`}</p>}
    </>
  );
}
