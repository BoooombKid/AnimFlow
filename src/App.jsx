import { useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader.jsx";
import { ProjectForm } from "./components/ProjectForm.jsx";
import { PipelinePreview } from "./components/PipelinePreview.jsx";
import { ActionBar } from "./components/ActionBar.jsx";
import { SuccessToast } from "./components/SuccessToast.jsx";
import { getPipelineTemplate } from "./data/pipelineTemplates.js";
import {
  createProjectStructure,
  isFileSystemAccessSupported,
  sanitizeProjectName,
} from "./lib/fileSystem.js";

const INITIAL_PROGRESS = { completed: 0, total: 0, current: "" };

export default function App() {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("3d");
  const [shotCount, setShotCount] = useState(25);
  const [destinationHandle, setDestinationHandle] = useState(null);
  const [expandedStages, setExpandedStages] = useState(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const numericShotCount = Math.min(999, Math.max(1, Number(shotCount) || 1));
  const pipeline = useMemo(
    () => getPipelineTemplate(projectType, numericShotCount, projectName),
    [projectType, numericShotCount, projectName],
  );
  const isSupported = isFileSystemAccessSupported();
  const canCreate = Boolean(
    sanitizeProjectName(projectName) && destinationHandle && isSupported,
  );

  const chooseDestination = async () => {
    setError("");
    setResult(null);
    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      setDestinationHandle(handle);
    } catch (pickerError) {
      if (pickerError?.name !== "AbortError") {
        setError(pickerError?.message || "Unable to access that folder.");
      }
    }
  };

  const createPipeline = async () => {
    if (!canCreate) return;
    setError("");
    setResult(null);
    setIsCreating(true);
    setProgress(INITIAL_PROGRESS);

    try {
      const creationResult = await createProjectStructure({
        destinationHandle,
        projectName,
        projectType,
        pipeline,
        onProgress: setProgress,
      });
      setResult(creationResult);
    } catch (creationError) {
      setError(creationError?.message || "The pipeline could not be created.");
    } finally {
      setIsCreating(false);
    }
  };

  const reset = () => {
    setProjectName("");
    setProjectType("3d");
    setShotCount(25);
    setDestinationHandle(null);
    setExpandedStages(new Set());
    setProgress(INITIAL_PROGRESS);
    setError("");
    setResult(null);
  };

  const toggleStage = (stageName) => {
    setExpandedStages((current) => {
      const next = new Set(current);
      if (next.has(stageName)) next.delete(stageName);
      else next.add(stageName);
      return next;
    });
  };

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="workspace">
        <div className="left-workspace">
          <ProjectForm
            projectName={projectName}
            setProjectName={setProjectName}
            shotCount={shotCount}
            setShotCount={setShotCount}
            projectType={projectType}
            setProjectType={setProjectType}
            destinationHandle={destinationHandle}
            onChooseDestination={chooseDestination}
            isSupported={isSupported}
            error={error}
          />
          <SuccessToast result={result} onDismiss={() => setResult(null)} />
        </div>
        <PipelinePreview
          pipeline={pipeline}
          expandedStages={expandedStages}
          onToggleStage={toggleStage}
        />
      </main>
      <ActionBar
        canCreate={canCreate}
        isCreating={isCreating}
        pipelineLength={pipeline.length}
        progress={progress}
        onCreate={createPipeline}
        onReset={reset}
      />
    </div>
  );
}
