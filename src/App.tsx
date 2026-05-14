import { PackProvider, usePackState } from "./hooks/usePackState";
import { MobileFrame } from "./layout/MobileFrame";
import { JoinScreen } from "./screens/JoinScreen";
import { PackScreen } from "./screens/PackScreen";

function Router() {
  const { state } = usePackState();
  return (
    <MobileFrame>{state.joined ? <PackScreen /> : <JoinScreen />}</MobileFrame>
  );
}

export default function App() {
  return (
    <PackProvider>
      <Router />
    </PackProvider>
  );
}
