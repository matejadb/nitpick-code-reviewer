import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/useAuthStore";
import { useReviewStore } from "../store/useReviewStore";
import Results from "../components/Results";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
  const { authUser, isLoggingOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [manualTab, setManualTab] = useState(null);

  const { reviewResult, isSubmitting, fetchReviews } = useReviewStore();
  const critiquesList = reviewResult.critiquesList;

  const activeTab = manualTab ?? (critiquesList ? "results" : "editor");

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (isLoggingOut) return <LoadingSpinner />;

  return (
    <div className="flex h-screen flex-col bg-neutral-950">
      <Navbar onSetMenuOpen={setIsMenuOpen} />
      {authUser && (
        <div className="flex min-h-0 flex-1">
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-50 bg-neutral-900/50 transition-all duration-300 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          )}
          <Sidebar isMenuOpen={isMenuOpen} onSetMenuOpen={setIsMenuOpen} />
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Mobile tab bar */}
            <div className="flex border-b border-neutral-800 lg:hidden">
              <button
                onClick={() => setManualTab("editor")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeTab === "editor"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setManualTab("results")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeTab === "results"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Results
                {critiquesList && (
                  <span className="ml-1.5 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                    {critiquesList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex min-h-0 flex-1 lg:flex-row">
              <div
                className={`min-h-0 flex-1 ${activeTab === "editor" ? "flex" : "hidden"} lg:flex`}
              >
                <CodeEditor />
              </div>
              <div
                className={`min-h-0 flex-1 lg:flex-none ${activeTab === "results" ? "flex" : "hidden"} lg:flex`}
              >
                <Results
                  isSubmitting={isSubmitting}
                  critiquesList={critiquesList}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
