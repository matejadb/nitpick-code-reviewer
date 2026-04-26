import CritiqueCard from "./CritiqueCard";
import LoadingBars from "./LoadingBars";

function Results({ critiquesList, isSubmitting }) {
  return (
    <div className="flex min-h-0 w-full flex-col border-l border-neutral-800 lg:w-96 lg:shrink-0">
      {/* Header */}
      <div className="border-b border-neutral-800 px-6 py-3">
        <h2 className="text-sm font-semibold text-white">Analysis Results</h2>
        {critiquesList && (
          <p className="text-xs text-neutral-400">
            {critiquesList.length} issue
            {critiquesList.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-scroll px-6 py-4">
        {isSubmitting && <LoadingBars />}

        {!isSubmitting && !critiquesList && (
          <p className="text-sm text-neutral-500">
            Submit your code to see the analysis.
          </p>
        )}

        {!isSubmitting && critiquesList?.length === 0 && (
          <p className="text-sm text-green-400">No issues found.</p>
        )}

        {!isSubmitting &&
          critiquesList?.map((result) => (
            <CritiqueCard
              key={result.text}
              text={result.text}
              category={result.category}
            />
          ))}
      </div>
    </div>
  );
}

export default Results;
