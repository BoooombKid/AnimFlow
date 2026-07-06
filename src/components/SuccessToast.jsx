import { CircleCheck, X } from "lucide-react";

export function SuccessToast({ result, onDismiss }) {
  if (!result) return null;

  return (
    <div className="success-toast" role="status">
      <CircleCheck aria-hidden="true" />
      <div>
        <strong>Pipeline created successfully!</strong>
        <span>
          {result.foldersCreated} folders created for {result.projectName}.
        </span>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss success message">
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
