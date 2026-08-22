"use client";

import { useState } from "react";
import Navbar from "../ComponentHome/Navbar";
import Footer from "../ComponentHome/Footer";
import DataHero from "./DataComponent/DataHero";
import DataDisclaimer from "./DataComponent/DataDisclaimer";
import DataTabs from "./DataComponent/DataTabs";
import DataSectionNav from "./DataComponent/DataSectionNav";
import CompanyTargets from "./DataComponent/CompanyTargets";
import DocumentsChart from "./DataComponent/DocumentsChart";
import RedistributionStats from "./DataComponent/RedistributionStats";
import RedistributionRadar from "./DataComponent/RedistributionRadar";
import FoodDonations from "./DataComponent/FoodDonations";
import Alliances from "./DataComponent/Alliances";
import UKStates from "./DataComponent/UKstates";
import EuCompanyData from "./DataComponenteu/Eucompanydata";
import EuDataHero from "./DataComponenteu/EuDataHero";
import DocumentEU from "./DataComponenteu/DocumentEU";
import EuAliance from "./DataComponenteu/Aliance";
import EuCharity from "./DataComponenteu/Charity";
import EUStates from "./DataComponenteu/EUStates";

import pageDataStyles from "./pageData.module.css";

export default function Page() {
  const [activeRegion, setActiveRegion] = useState("UK");

  const handleTabChange = (region) => {
    setActiveRegion(region);
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <DataDisclaimer />
      </div>
      <DataTabs onTabChange={handleTabChange} />
      <DataSectionNav activeRegion={activeRegion} />

      {/* UK Data */}
      <div
        className={pageDataStyles.regionWrapper}
        style={{ display: activeRegion === "UK" ? "block" : "none" }}
      >
        <DataHero />
        <UKStates />
        <CompanyTargets />
        <DocumentsChart />
        <Alliances />
      </div>

      {/* EU Data */}
      <div
        className={pageDataStyles.regionWrapper}
        style={{ display: activeRegion === "EU" ? "block" : "none" }}
      >
        <EuDataHero />
        <EuCompanyData />
        <DocumentEU />

        <EuAliance />
        <EuCharity />
      </div>

      <Footer />
    </div>
  );
}
