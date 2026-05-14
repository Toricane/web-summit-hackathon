import { GroupProvider, useGroupState } from "./hooks/useGroupState";
import { MobileFrame } from "./layout/MobileFrame";
import { JoinScreen } from "./screens/JoinScreen";
import { GroupScreen } from "./screens/GroupScreen";

function Router() {
  const { state } = useGroupState();
  return (
    <MobileFrame>{state.joined ? <GroupScreen /> : <JoinScreen />}</MobileFrame>
  );
}

export default function App() {
  return (
    <GroupProvider>
      <Router />
    </GroupProvider>
  );
}
