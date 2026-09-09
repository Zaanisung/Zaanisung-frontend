import { useAppState } from "./hooks/useAppState";
import { AppRouter } from "./router";
import { Loader } from "./components/ui/Loader";

export default function App() {
  const state = useAppState();

  if (state.isBootstrapping) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cream dark:bg-black"
        role="status"
        aria-label="Loading"
      >
        <Loader variant="ring" size="lg" />
      </div>
    );
  }

  return <AppRouter {...state} />;
}