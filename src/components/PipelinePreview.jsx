import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";

function ChildPreview({ children }) {
  const visibleChildren = children.slice(0, 6);
  const remaining = children.length - visibleChildren.length;

  return (
    <div className="child-preview">
      {visibleChildren.map((child) => (
        <div className="child-row" key={child.name}>
          <Folder aria-hidden="true" />
          <span>{child.name}</span>
          {child.children.length > 0 && (
            <span className="child-count">{child.children.length} folders</span>
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="child-row child-overflow">
          <span>+{remaining} more folders</span>
        </div>
      )}
    </div>
  );
}

export function PipelinePreview({ pipeline, expandedStages, onToggleStage }) {
  return (
    <section className="preview-panel" aria-labelledby="preview-title">
      <div className="preview-heading">
        <h2 id="preview-title">Pipeline preview</h2>
        <span>{pipeline.length} stages</span>
      </div>

      <div className="stage-list">
        {pipeline.map((stage) => {
          const expanded = expandedStages.has(stage.name);
          const displayName = stage.name
            .replaceAll("_", " ")
            .replace("FX Simulation", "FX & Simulation")
            .replace("Lighting LookDev", "Lighting & LookDev");
          return (
            <div className="stage-item" key={stage.name}>
              <button
                type="button"
                className="stage-row"
                aria-label={`Toggle ${displayName} details`}
                aria-expanded={expanded}
                onClick={() => onToggleStage(stage.name)}
              >
                {expanded ? (
                  <ChevronDown className="chevron" aria-hidden="true" />
                ) : (
                  <ChevronRight className="chevron" aria-hidden="true" />
                )}
                <Folder className="folder-icon" aria-hidden="true" />
                <span className="stage-name">{displayName}</span>
                <span className="readme-indicator">
                  <FileText aria-hidden="true" />
                  README.txt
                </span>
              </button>
              {expanded && <ChildPreview children={stage.children} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
