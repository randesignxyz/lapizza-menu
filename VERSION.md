# UI versions

## UI V1 — saved

`versions/ui-v1.zip` is the complete source snapshot before V2 work, including the image cards, grid/list switch, search, favourites, carousel, tests, and documentation. Dependencies and generated files are excluded. `versions/ui-v1.manifest.json` records SHA-256 checksums for every archived file.

To preview V1, extract the archive into a separate directory and run `npm run dev` there. Use another port if the V2 server is running. Do not extract over the working project unless you intend to restore V1.

## UI V2 — active working version

The project root is the V2 workspace (`2.0.0-dev.0`). It starts from the saved V1 implementation. V2 opens directly to a printed-menu-inspired list, grouped by category, with compact photos and aligned prices. The optional grid view, search, and favourites remain available.

Keep the V1 archive intact while editing the root files for V2.
