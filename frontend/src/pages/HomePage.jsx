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
      {authUser && (
        <>
          <Navbar onSetMenuOpen={setIsMenuOpen} />
          <div className="flex flex-1 flex-col lg:flex-row">
            <Sidebar isMenuOpen={isMenuOpen} onSetMenuOpen={setIsMenuOpen} />
            <CodeEditor />
            <div className="w-96 border-l border-neutral-800 px-6 py-2 text-white">
              {/* Results panel */}
              <h1>Analysis results will be shown here</h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
