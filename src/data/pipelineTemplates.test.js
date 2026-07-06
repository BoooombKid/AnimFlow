import { describe, expect, it } from "vitest";
import {
  countFolders,
  getPipelineTemplate,
  getProjectTypeLabel,
} from "./pipelineTemplates.js";

describe("pipeline templates", () => {
  it("creates twelve ordered stages for every project type", () => {
    for (const type of ["3d", "2d", "stop-motion"]) {
      const pipeline = getPipelineTemplate(type, 3);
      expect(pipeline).toHaveLength(12);
      expect(pipeline[0].name.startsWith("01_")).toBe(true);
      expect(pipeline.at(-1).name).toBe("12_Final_Delivery");
    }
  });

  it("creates the requested number of three-digit 3D layout shots", () => {
    const layout = getPipelineTemplate("3d", 4)[1];
    expect(layout.children.map(({ name }) => name)).toEqual([
      "HM_layout_sc001",
      "HM_layout_sc002",
      "HM_layout_sc003",
      "HM_layout_sc004",
    ]);
  });

  it("uses project-type-specific production stages", () => {
    const twoD = getPipelineTemplate("2d", 1).map(({ name }) => name);
    const stopMotion = getPipelineTemplate("stop-motion", 1).map(({ name }) => name);

    expect(twoD).toContain("05_Rough_Animation");
    expect(twoD).toContain("07_Color");
    expect(stopMotion).toContain("02_Art_Department");
    expect(stopMotion).toContain("06_Capture");
  });

  it("limits shot counts to a safe range", () => {
    expect(getPipelineTemplate("3d", 0)[1].children).toHaveLength(1);
    expect(getPipelineTemplate("3d", 1200)[1].children).toHaveLength(999);
  });

  it("counts every nested folder", () => {
    const pipeline = getPipelineTemplate("3d", 2);
    expect(countFolders(pipeline)).toBeGreaterThan(40);
  });

  it("returns readable type labels", () => {
    expect(getProjectTypeLabel("3d")).toBe("3D Animation");
    expect(getProjectTypeLabel("stop-motion")).toBe("Stop Motion");
  });
});
