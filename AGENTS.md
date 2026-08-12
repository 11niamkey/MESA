# Agent Save Settings / Backup Instructions

Whenever you modify code files in this workspace (for example, `App.tsx` or components):
1. Maintain backup copies in the `backups/` folder.
2. Save a snapshot of the modified state with an increasing version counter suffix (e.g., `App_v1.tsx`, `App_v2.tsx`, etc.).
3. Ensure chronological integrity so every change has its corresponding incremental backup in the `backups/` subdirectory.

## Active Project Rules
- **Automatic Backups**: Always save backups under `/backups/` whenever you perform edits to core files.
- **Strict User Intent**: Build exactly what the user has requested, centering visual polish, elegant typography, spacing, and rhythm.
