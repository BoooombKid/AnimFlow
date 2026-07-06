export const PROJECT_TYPES = [
  { id: "3d", label: "3D Animation", shortLabel: "3D" },
  { id: "2d", label: "2D Animation", shortLabel: "2D" },
  { id: "stop-motion", label: "Stop Motion", shortLabel: "Stop Motion" },
];

const folder = (name, description, children = []) => ({
  name,
  description,
  children,
});

const padShot = (number) => String(number).padStart(3, "0");

export function getProjectPrefix(projectName = "") {
  const words = String(projectName).match(/[\p{L}\p{N}]+/gu) ?? [];
  if (words.length === 0) return "Project";
  if (words.length === 1) return words[0];
  return words.map((word) => Array.from(word)[0].toUpperCase()).join("");
}

const shotPrefix = (projectPrefix, stage) => `${projectPrefix}_${stage}_sc`;

const shotFolders = (count, prefix, description, children = []) =>
  Array.from({ length: count }, (_, index) => {
    const shot = padShot(index + 1);
    return folder(
      `${prefix}${shot}`,
      `${description} Shot sc${shot}.`,
      children.map((child) => ({ ...child, children: [...child.children] })),
    );
  });

const numberedStage = (number, name, description, children = []) =>
  folder(`${String(number).padStart(2, "0")}_${name}`, description, children);

const assetStage3d = () =>
  numberedStage(1, "Asset", "Reusable 3D production assets and references.", [
    folder("Characters", "Character models, sculpt files, topology, and approved versions."),
    folder("Environments", "Environment models, sets, and world-building assets."),
    folder("Props", "Reusable hero and background prop assets."),
    folder("Materials_Textures", "Materials, texture maps, palettes, and look references."),
    folder("Rigs", "Character, prop, and mechanical rig files."),
    folder("References", "Visual references, research, turnarounds, and source notes."),
  ]);

const editingStage = (shotCount, projectPrefix) =>
  numberedStage(9, "Editing", "Editorial projects, shot media, cuts, subtitles, and exports.", [
    folder("Project_Files", "Editing application projects and autosave backups."),
    folder(
      "Media",
      "Rendered or composited shot media used by editorial.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "edit"), "Editorial media for"),
    ),
    folder("Cuts", "Whole-film editorial versions.", [
      folder("Rough_Cut", "Story order, timing, and early pacing reviews."),
      folder("Fine_Cut", "Precise edit points, transitions, and sound-picture refinement."),
      folder("Final_Cut", "Picture-locked final editorial versions."),
    ]),
    folder("Subtitles", "Subtitle files, transcripts, and caption review versions."),
    folder("Exports", "Editorial review files and pre-delivery exports."),
  ]);

const soundStage = (shotCount, projectPrefix) =>
  numberedStage(10, "Sound", "Shared sound assets, shot audio, projects, and mixes.", [
    folder("Library", "Reusable and licensed audio assets.", [
      folder("Music", "Music tracks, stems, edits, and license records."),
      folder("SFX", "Designed and sourced sound effects."),
      folder("Ambience", "Room tone, environments, and atmospheric beds."),
      folder("Foley", "Recorded movement and object performance sounds."),
      folder("Voice", "Dialogue, narration, breaths, and voice recordings."),
    ]),
    folder("Project_Files", "DAW sessions and sound project backups."),
    folder(
      "Shot_Sound",
      "Shot-specific sync, Foley, and sound design.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "sound"), "Sound work for"),
    ),
    folder("Mixes", "Whole-film mix reviews and masters.", [
      folder("Preview", "Temporary and review mixes."),
      folder("Final", "Approved final mix and delivery stems."),
    ]),
  ]);

const reviewStage = (shotCount, projectPrefix) =>
  numberedStage(11, "Review", "Daily reviews, shot feedback, and approvals.", [
    folder("Daily_Review", "Whole-project daily review exports and notes."),
    folder(
      "Shot_Reviews",
      "Feedback and approvals organized by shot.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "review"), "Review records for", [
        folder("Feedback", "Notes, annotations, and requested changes."),
        folder("Approved", "Approved review versions and sign-off records."),
      ]),
    ),
  ]);

const finalDeliveryStage = () =>
  numberedStage(12, "Final_Delivery", "Final project-level submission packages.", [
    folder("Master_Video", "High-quality final video masters."),
    folder("Final_Audio", "Final mixes, stems, and delivery audio."),
    folder("Subtitles", "Final subtitles and captions."),
    folder("Presentation", "Presentation files and supporting images."),
    folder("Submission_Backup", "Verified backup of the complete submission package."),
  ]);

const pipeline3d = (shotCount, projectPrefix) => [
  assetStage3d(),
  numberedStage(
    2,
    "Layout",
    "Camera, composition, lens, staging, and shot timing.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "layout"), "Layout for"),
  ),
  numberedStage(
    3,
    "Blocking",
    "Key poses, broad action, performance beats, and timing tests.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "blocking"), "Animation blocking for"),
  ),
  numberedStage(
    4,
    "Animation",
    "Spline animation, polish, facial performance, and final motion.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "animation"), "Final animation for"),
  ),
  numberedStage(5, "FX_Simulation", "Simulation tests and shot-specific effects.", [
    folder("Shared_Tests", "Reusable FX tests and technical validation."),
    folder(
      "Shots",
      "FX production organized by shot.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "fx"), "FX work for", [
        folder("Work", "Working scene files and iterations."),
        folder("Cache", "Simulation caches tied to this shot."),
        folder("Approved", "Approved effects ready for lighting or compositing."),
      ]),
    ),
  ]),
  numberedStage(6, "Lighting_LookDev", "Shared look development and final shot lighting.", [
    folder("Shared_LookDev", "Reusable look-development resources.", [
      folder("Material_Tests", "Material, texture, color, and surface tests."),
      folder("HDRI", "Licensed HDRI maps and source records."),
      folder("Lighting_Rigs", "Reusable lighting rigs and presets."),
    ]),
    folder(
      "Shot_Lighting",
      "Final lighting organized by shot.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "lighting"), "Lighting for"),
    ),
  ]),
  numberedStage(7, "Render", "Render settings and shot outputs.", [
    folder("Render_Settings", "Render engine, sampling, color management, and output presets."),
    folder(
      "Shots",
      "Render outputs organized by shot.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "render"), "Rendering for", [
        folder("Preview", "Low-cost preview renders."),
        folder("Final", "Approved final image sequences or movies."),
        folder("Passes", "Beauty, emission, shadow, depth, cryptomatte, and utility passes."),
      ]),
    ),
  ]),
  numberedStage(8, "Compositing", "Shared elements and shot-based compositing.", [
    folder("Shared_Elements", "Shared LUTs, masks, templates, and graphic elements."),
    folder(
      "Shots",
      "Compositing work organized by shot.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "comp"), "Compositing for", [
        folder("Project_Files", "Compositing project files and backups."),
        folder("Preview", "Review renders and work-in-progress composites."),
        folder("Final", "Approved final composites."),
      ]),
    ),
  ]),
  editingStage(shotCount, projectPrefix),
  soundStage(shotCount, projectPrefix),
  reviewStage(shotCount, projectPrefix),
  finalDeliveryStage(),
];

const pipeline2d = (shotCount, projectPrefix) => [
  numberedStage(1, "Asset", "Reusable 2D art assets and visual references.", [
    folder("Characters", "Character designs, turnarounds, expressions, and model sheets."),
    folder("Backgrounds", "Background paintings, layouts, and environment designs."),
    folder("Props", "Reusable prop designs and approved artwork."),
    folder("Color_Palettes", "Character, environment, and sequence color palettes."),
    folder("Brushes", "Approved brush libraries and drawing-tool presets."),
    folder("References", "Research, style references, and source notes."),
  ]),
  numberedStage(2, "Storyboard", "Shot drawings, staging, continuity, and visual storytelling.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "storyboard"), "Storyboard panels for")),
  numberedStage(3, "Animatic", "Timed storyboard edits, temporary sound, and pacing tests.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "animatic"), "Animatic work for")),
  numberedStage(4, "Layout", "Final framing, perspective, background layout, and staging.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "layout"), "2D layout for")),
  numberedStage(5, "Rough_Animation", "Key drawings, breakdowns, and rough motion.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "roughanim"), "Rough animation for")),
  numberedStage(6, "Clean_Up", "Clean line work, final drawing consistency, and model correction.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "cleanup"), "Clean-up work for")),
  numberedStage(7, "Color", "Flat color, shadows, highlights, and paint corrections.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "color"), "Color work for")),
  numberedStage(8, "Compositing", "Layer assembly, camera moves, effects, and final shot output.", [
    folder("Shared_Elements", "Shared textures, overlays, LUTs, and reusable effects."),
    folder("Shots", "Compositing work organized by shot.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "comp"), "2D compositing for", [
        folder("Project_Files", "Compositing project files and backups."),
        folder("Preview", "Review composites."),
        folder("Final", "Approved final composites."),
      ])),
  ]),
  editingStage(shotCount, projectPrefix),
  soundStage(shotCount, projectPrefix),
  reviewStage(shotCount, projectPrefix),
  finalDeliveryStage(),
];

const pipelineStopMotion = (shotCount, projectPrefix) => [
  numberedStage(1, "Asset", "Puppet, prop, replacement, and reference assets.", [
    folder("Puppets", "Puppet builds, replacement parts, armatures, and maintenance records."),
    folder("Props", "Hero and background props."),
    folder("Replacement_Parts", "Faces, hands, mouths, and other replacement animation parts."),
    folder("References", "Designs, scale references, tests, and source notes."),
  ]),
  numberedStage(2, "Art_Department", "Physical fabrication, sets, costumes, and build documentation.", [
    folder("Sets", "Set construction, dressing, and maintenance."),
    folder("Costumes", "Costume builds, repairs, and continuity."),
    folder("Fabrication", "Fabrication plans, molds, prints, and workshop files."),
    folder("Continuity", "Continuity images and physical-state records."),
  ]),
  numberedStage(3, "Storyboard", "Shot drawings, staging, continuity, and visual storytelling.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "storyboard"), "Storyboard panels for")),
  numberedStage(4, "Animatic", "Timed boards, temporary sound, and shot-length planning.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "animatic"), "Animatic work for")),
  numberedStage(5, "Setup", "Stage preparation, rigging, lighting, camera, and exposure tests.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "setup"), "Stop-motion setup for", [
      folder("Camera_Tests", "Camera, lens, focus, and framing tests."),
      folder("Lighting_Tests", "Lighting, flicker, exposure, and color tests."),
      folder("Rigging", "Puppet support, tie-down, and removal-rig planning."),
    ])),
  numberedStage(6, "Capture", "Captured frames, exposure sheets, and take records.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "capture"), "Captured frames for", [
      folder("Raw_Frames", "Original captured image sequences."),
      folder("Exposure_Sheets", "Frame counts, dialogue timing, and animator notes."),
      folder("Takes", "Alternate takes and approved-take records."),
    ])),
  numberedStage(7, "Frame_QC", "Frame inspection, flicker checks, cleanup notes, and approvals.",
    shotFolders(shotCount, shotPrefix(projectPrefix, "frameqc"), "Frame quality control for", [
      folder("Issues", "QC notes and identified frame problems."),
      folder("Approved", "Approved frame sequences ready for compositing."),
    ])),
  numberedStage(8, "Compositing", "Rig removal, cleanup, stabilization, effects, and final shots.", [
    folder("Shared_Elements", "Shared cleanup tools, plates, LUTs, and graphic elements."),
    folder("Shots", "Compositing work organized by shot.",
      shotFolders(shotCount, shotPrefix(projectPrefix, "comp"), "Stop-motion compositing for", [
        folder("Project_Files", "Compositing project files and backups."),
        folder("Cleanup", "Rig removal, paint fixes, and stabilization."),
        folder("Final", "Approved final composites."),
      ])),
  ]),
  editingStage(shotCount, projectPrefix),
  soundStage(shotCount, projectPrefix),
  reviewStage(shotCount, projectPrefix),
  finalDeliveryStage(),
];

const BUILDERS = {
  "3d": pipeline3d,
  "2d": pipeline2d,
  "stop-motion": pipelineStopMotion,
};

export function getPipelineTemplate(projectType, shotCount = 25, projectName = "") {
  const safeCount = Math.min(999, Math.max(1, Number(shotCount) || 1));
  const builder = BUILDERS[projectType] ?? BUILDERS["3d"];
  return builder(safeCount, getProjectPrefix(projectName));
}

export function getProjectTypeLabel(projectType) {
  return PROJECT_TYPES.find(({ id }) => id === projectType)?.label ?? "3D Animation";
}

export function countFolders(nodes) {
  return nodes.reduce(
    (total, node) => total + 1 + countFolders(node.children),
    0,
  );
}
