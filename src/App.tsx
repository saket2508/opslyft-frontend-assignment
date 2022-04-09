import React from "react";
import logo from "./logo.svg";
import Navbar from "./components/Navbar";
import DataContainer from "./components/DataContainer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="pt-1">
      <section className="mt-4 d-flex justify-content-center">
        <DataContainer />
      </section>
      </div>
    </div>
  );
}

export default App;
