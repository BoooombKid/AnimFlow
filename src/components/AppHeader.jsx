import { FolderKanban, Github } from "lucide-react";

export function AppHeader() {
  return (
    <header className="app-header">
      <a className="brand" href="./" aria-label="AnimFlow home">
        <FolderKanban aria-hidden="true" />
        <span>AnimFlow</span>
      </a>
      <a
        className="icon-link"
        href="https://github.com/BoooombKid/AnimFlow"
        target="_blank"
        rel="noreferrer"
        aria-label="View AnimFlow on GitHub"
        title="View source on GitHub"
      >
        <Github aria-hidden="true" />
      </a>
    </header>
  );
}
