import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import ReduxDataProvider from "./redux/store";
import { DataProvider } from "./GlobalState";

ReactDOM.render(
  <ReduxDataProvider>
    <DataProvider>
      <App />
    </DataProvider>
  </ReduxDataProvider>,
  document.getElementById("root")
);
