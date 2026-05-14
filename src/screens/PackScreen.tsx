import { useState } from "react";
import { PackHeader } from "../features/pack/PackHeader";
import { TabBar, type TabId } from "../features/pack/TabBar";
import { EventsTab } from "../features/pack/EventsTab";
import { StatusTab } from "../features/pack/StatusTab";
import { MapTab } from "../features/pack/MapTab";
import { AIMatchTab } from "../features/pack/AIMatchTab";
import { EmergencyBanner } from "../features/pack/EmergencySheet";
import { BottomNav } from "../layout/BottomNav";

export function PackScreen() {
  const [tab, setTab] = useState<TabId>("events");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-app">
      <PackHeader />
      <EmergencyBanner />
      <TabBar active={tab} onChange={setTab} />
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        {tab === "events" && <EventsTab onSwitchTab={setTab} />}
        {tab === "status" && <StatusTab />}
        {tab === "map" && <MapTab />}
        {tab === "ai" && <AIMatchTab onSwitchTab={setTab} />}
      </div>
      <BottomNav />
    </div>
  );
}
