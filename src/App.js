import React from "react";
import "./styles/App.css";
import "monday-ui-react-core/dist/main.css";
import { Loader } from "monday-ui-react-core";
import Number from "./components/Number";
import Ticker from "./components/Ticker";
import Benchmark from "./components/Benchmark";
import Goal from "./components/Goal";
import useContext from "./hooks/useContext";

export default function App() {
  const { settings, values, ticker, theme } = useContext();

  if (settings?.type === undefined || values === undefined)
    return (
      <div className={`${theme} App`}>
        <Loader size={Loader.sizes.SMALL} />
      </div>
    );

  return (
    <div className={`${theme} App`}>
      {settings.type === "numbers" && (
        <Number values={values} settings={settings} />
      )}
      {settings.type === "ticker" && (
        <Ticker values={values} ticker={ticker} settings={settings} />
      )}
      {settings.type === "benchmark" && (
        <Benchmark values={values} settings={settings} />
      )}
      {settings.type === "goal" && <Goal values={values} settings={settings} />}
    </div>
  );
}
