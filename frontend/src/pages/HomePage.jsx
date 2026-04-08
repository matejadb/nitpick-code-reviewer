import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950">
      {authUser && (
        <>
          <Navbar onSetMenuOpen={setIsMenuOpen} />
          <Sidebar isMenuOpen={isMenuOpen} onSetMenuOpen={setIsMenuOpen} />
          <CodeEditor />
        </>
      )}
    </div>
  );
}

export default HomePage;
