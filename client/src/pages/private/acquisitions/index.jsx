import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import SidebarPanel from "../../../components/ui/SidebarPanel";
import UnderDevelopment from "../../Handlers/UnderDevelopment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Aquisitons() {
  const [activeTab, setActiveTab] = useState("Pending");
  const navigate = useNavigate();

  const stats = [
    { label: "Archived", value: 2 },
    { label: "Pending", value: 2 },
    { label: "Records", value: 2 },
  ];

  const tabs = ["Pending", "Posted", "Archived"];

  return (
    <div className="flex flex-col gap-y-2 h-full">
      <Breadcrumbs />

      <div className="h-[4rem] flex justify-start items-center">
        <h1 className="text-3xl font-semibold">
          Artifacts Acquisiton Management
        </h1>
      </div>

      <div className="h-full flex gap-x-5">
        {/* sidbar*/}
        <SidebarPanel
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalLabel="Total Acquisitions"
          showDate
          stats={stats}
          buttonText="Add New Artifact"
          onButtonClick={() => navigate("walk-in-appointment")}
          buttonPerm="acquisitions.create"
        />

        <UnderDevelopment />
      </div>
    </div>
  );
}
