import { CircleCheck, LoaderCircle, Play, RotateCcw } from "lucide-react";

export function ActionBar({
  canCreate,
  isCreating,
  pipelineLength,
  progress,
  onCreate,
  onReset,
}) {
  const statusText = isCreating
    ? `Creating folder ${progress.completed} of ${progress.total}`
    : `Ready to create ${pipelineLength} production stages`;

  return (
    <footer className="action-bar">
      <div className="ready-status" aria-live="polite">
        {isCreating ? (
          <LoaderCircle className="spin" aria-hidden="true" />
        ) : (
          <CircleCheck aria-hidden="true" />
        )}
        <span>{statusText}</span>
      </div>

      <div className="action-buttons">
        <button className="reset-button" type="button" onClick={onReset} disabled={isCreating}>
          <RotateCcw aria-hidden="true" />
          Reset
        </button>
        <button
          className="create-button"
          type="button"
          onClick={onCreate}
          disabled={!canCreate || isCreating}
        >
          {isCreating ? (
            <LoaderCircle className="spin" aria-hidden="true" />
          ) : (
            <Play aria-hidden="true" />
          )}
          {isCreating ? "Creating…" : "Create pipeline"}
        </button>
      </div>
    </footer>
  );
}
