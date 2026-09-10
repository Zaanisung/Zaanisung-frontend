import { useAppState } from "./hooks/useAppState";
import { AppRouter } from "./router";
import { FullPageLoader } from "./components/ui/Loader";

export default function App() {
  const state = useAppState();

  if (state.isBootstrapping) {
    return <FullPageLoader />;
  }

  return <AppRouter {...state} />;
}