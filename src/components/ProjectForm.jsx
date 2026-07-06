import {
  Box,
  Camera,
  Clapperboard,
  FolderOpen,
  PenTool,
} from "lucide-react";
import { PROJECT_TYPES } from "../data/pipelineTemplates.js";

const TYPE_ICONS = {
  "3d": Box,
  "2d": PenTool,
  "stop-motion": Camera,
};

export function ProjectForm({
  projectName,
  setProjectName,
  shotCount,
  setShotCount,
  projectType,
  setProjectType,
  destinationHandle,
  onChooseDestination,
  isSupported,
  error,
}) {
  return (
    <section className="form-panel" aria-labelledby="builder-title">
      <div className="form-heading">
        <h1 id="builder-title">Animation Pipeline Builder</h1>
        <p>Create a production-ready project structure in one click.</p>
      </div>

      <div className="project-fields-row">
        <label className="field project-name-field">
          <span>Project name</span>
          <span className="input-shell">
            <Clapperboard aria-hidden="true" />
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="My Awesome Animation"
              autoComplete="off"
            />
          </span>
        </label>

        <label className="field shot-count-field">
          <span>Shot count</span>
          <input
            className="number-input"
            type="number"
            min="1"
            max="999"
            value={shotCount}
            onChange={(event) => setShotCount(event.target.value)}
          />
        </label>
      </div>

      <fieldset className="field type-field">
        <legend>Project type</legend>
        <div className="segmented-control">
          {PROJECT_TYPES.map((type) => {
            const Icon = TYPE_ICONS[type.id];
            const selected = type.id === projectType;
            return (
              <button
                className="segment"
                type="button"
                key={type.id}
                aria-label={type.label}
                aria-pressed={selected}
                onClick={() => setProjectType(type.id)}
              >
                <Icon aria-hidden="true" />
                <span className="type-long-label">{type.label}</span>
                <span className="type-short-label">{type.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="field destination-field">
        <span className="field-label">Destination folder</span>
        <div className="destination-shell">
          <FolderOpen aria-hidden="true" />
          <span className={destinationHandle ? "destination-name" : "destination-placeholder"}>
            {destinationHandle?.name ?? "No folder selected"}
          </span>
          <button
            type="button"
            className="choose-button"
            onClick={onChooseDestination}
            disabled={!isSupported}
          >
            <FolderOpen aria-hidden="true" />
            Choose folder
          </button>
        </div>
        <p className={error ? "field-message error-message" : "field-message"} role="status">
          {error ||
            (isSupported
              ? destinationHandle
                ? "Folder access granted. Your files stay on this device."
                : "Choose a parent folder for the new project."
              : "Direct folder creation requires Chrome or Edge on HTTPS or localhost.")}
        </p>
      </div>
    </section>
  );
}
