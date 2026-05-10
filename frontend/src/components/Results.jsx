import { useTranslation } from "react-i18next";
import CritiqueCard from "./CritiqueCard";
import LoadingBars from "./LoadingBars";

function Results({ critiquesList, isSubmitting }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-0 w-full flex-col border-l border-neutral-800 lg:w-96 lg:shrink-0">
      {/* Header */}
      <div className="border-b border-neutral-800 px-6 py-3">
        <h2 className="text-sm font-semibold text-white">
          {t("results.analysisResults")}
        </h2>
        {critiquesList && (
          <p className="text-xs text-neutral-400">
            {critiquesList.length}{" "}
            {critiquesList.length === 1
              ? t("results.issue")
              : t("results.issues_plural")}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-scroll px-6 py-4">
        {isSubmitting && <LoadingBars />}

        {!isSubmitting && !critiquesList && (
          <p className="text-sm text-neutral-500">
            {t("results.submitCodeToSee")}
          </p>
        )}

        {!isSubmitting && critiquesList?.length === 0 && (
          <p className="text-sm text-green-400">{t("results.noIssuesFound")}</p>
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
