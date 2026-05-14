import { useState } from "react";
import { GroupHeader } from "../features/group/GroupHeader";
import { TabBar, type TabId } from "../features/group/TabBar";
import { EventsTab } from "../features/group/EventsTab";
import { StatusTab } from "../features/group/StatusTab";
import { MapTab } from "../features/group/MapTab";
import { AIMatchTab } from "../features/group/AIMatchTab";
import { BottomNav } from "../layout/BottomNav";

export function GroupScreen() {
  const [tab, setTab] = useState<TabId>("events");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-app">
      <GroupHeader />
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
