import { describe, expect, it, vi } from "vitest";
import {
  buildFolderReadme,
  createProjectStructure,
  sanitizeProjectName,
} from "./fileSystem.js";
import { getPipelineTemplate } from "../data/pipelineTemplates.js";

class MemoryWritable {
  constructor(file) {
    this.file = file;
  }

  async write(contents) {
    this.file.contents = contents;
  }

  async close() {}
}

class MemoryFileHandle {
  constructor(name) {
    this.name = name;
    this.contents = "";
  }

  async createWritable() {
    return new MemoryWritable(this);
  }
}

class MemoryDirectoryHandle {
  constructor(name) {
    this.name = name;
    this.directories = new Map();
    this.files = new Map();
  }

  async getDirectoryHandle(name, { create = false } = {}) {
    if (this.directories.has(name)) return this.directories.get(name);
    if (!create) {
      const error = new Error("Directory not found");
      error.name = "NotFoundError";
      throw error;
    }
    const directory = new MemoryDirectoryHandle(name);
    this.directories.set(name, directory);
    return directory;
  }

  async getFileHandle(name, { create = false } = {}) {
    if (this.files.has(name)) return this.files.get(name);
    if (!create) {
      const error = new Error("File not found");
      error.name = "NotFoundError";
      throw error;
    }
    const file = new MemoryFileHandle(name);
    this.files.set(name, file);
    return file;
  }
}

describe("file system generation", () => {
  it("sanitizes project folder names for common desktop platforms", () => {
    expect(sanitizeProjectName('  My:Film/Project*  ')).toBe("My-Film-Project-");
    expect(sanitizeProjectName("Untitled... ")).toBe("Untitled");
  });

  it("builds contextual README content", () => {
    const readme = buildFolderReadme({
      projectName: "HER MOVE",
      projectType: "3d",
      relativePath: "HER MOVE/03_Blocking/HM_blocking_sc001",
      description: "Animation blocking for shot sc001.",
    });

    expect(readme).toContain("HM_blocking_sc001\n=================");
    expect(readme).toContain("3D Animation");
    expect(readme).toContain("Animation blocking for shot sc001.");
  });

  it("creates the hierarchy and a README.txt in every generated folder", async () => {
    const destination = new MemoryDirectoryHandle("Projects");
    const pipeline = getPipelineTemplate("3d", 1).slice(0, 2);
    const onProgress = vi.fn();

    const result = await createProjectStructure({
      destinationHandle: destination,
      projectName: "Test Project",
      projectType: "3d",
      pipeline,
      onProgress,
    });

    const project = destination.directories.get("Test Project");
    const asset = project.directories.get("01_Asset");
    const layout = project.directories.get("02_Layout");
    const shot = layout.directories.get("HM_layout_sc001");

    expect(project.files.has("README.txt")).toBe(true);
    expect(asset.files.has("README.txt")).toBe(true);
    expect(shot.files.has("README.txt")).toBe(true);
    expect(project.files.has("README.md")).toBe(false);
    expect(result.foldersCreated).toBe(onProgress.mock.calls.length);
  });

  it("refuses to overwrite an existing project folder", async () => {
    const destination = new MemoryDirectoryHandle("Projects");
    await destination.getDirectoryHandle("Existing Project", { create: true });

    await expect(
      createProjectStructure({
        destinationHandle: destination,
        projectName: "Existing Project",
        projectType: "2d",
        pipeline: getPipelineTemplate("2d", 1),
      }),
    ).rejects.toThrow("already exists");
  });
});
