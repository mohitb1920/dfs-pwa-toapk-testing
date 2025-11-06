import React from "react";
import Dashboard from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";

function DSSModule({ initData }) {
  return (
    <div>
      <Routes>
        <Route
          path={"/:dashboardCode"}
          element={<Dashboard initData={initData} />}
        />
      </Routes>
    </div>
  );
}

DSSModule.prototypes = {
  initData: PropTypes.object,
};

export default DSSModule;
