import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <Navbar onSetMenuOpen={setIsMenuOpen} />
      {authUser && (
        <div className="flex min-h-0 flex-1">
          <Sidebar isMenuOpen={isMenuOpen} onSetMenuOpen={setIsMenuOpen} />
          <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
            <CodeEditor />
            <div className="w-96 border-l border-neutral-800 px-6 py-2 text-white">
              {/* Results panel */}
              <h1>Analysis results will be shown here</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
