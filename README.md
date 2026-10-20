# La Pizza digital menu — UI V2

A responsive static restaurant menu using native JavaScript modules. No application framework or build step is required.

## Local development

Use Node.js 22+ and Python 3. Run `npm run dev`, then open http://127.0.0.1:5173. Serve the project over HTTP; opening `index.html` directly cannot load modules or menu data reliably.

- `npm test` runs the data, filtering, and storage regression tests.
- `npm run format` formats source files with the pinned Prettier version.
- `npm run format:check` checks formatting.

## Architecture

- `index.html`: semantic page structure, dialog, and accessibility landmarks.
- `style.css`: responsive layout, visual tokens, and reduced-motion support.
- `src/main.js`: application composition; connects independent features.
- `src/menu/controller.js`: menu UI, user interaction, and private feature state.
- `src/menu/view.js`: safe dish-card DOM construction.
- `src/menu/model.js`: pure filtering, price formatting, and data validation.
- `src/menu/repository.js`: HTTP loading and validation at the data boundary.
- `src/menu/storage.js`: defensive favourites persistence.
- `src/carousel/index.js`: retained V1 carousel module, inactive in V2.
- `menu.json`: menu content; existing dish IDs must remain stable to preserve favourites.

Keep dish content in JSON and render it with `textContent`. Carousel HTML/SVG strings are trusted source code and must never be populated from user input or menu data. New behavior should live in its owning feature; features communicate through explicit callbacks rather than global variables.

## Menu updates and deployment

Each dish requires a unique nonempty `id`, a `category`, a `name`, a string `description` (which may be empty), and a finite nonnegative numeric `price` in USD. Run `npm test` after editing the menu.

Deploy the project directory to any static HTTP host, including all files in `src/` and `menu.json`. There is no backend, ordering system, or secret configuration. Favourites are stored locally in the customer's browser and remain usable in memory when storage is unavailable. Fonts currently load from Google Fonts with system fallbacks.

Before release, check search, combined category/favourites filters, empty results, reload persistence, dish dialogs, carousel controls and swipe, keyboard navigation, and mobile layout in a browser.

## Product photos

Each dish has an `image` URL and descriptive `imageAlt` in `menu.json`. The initial Unsplash photos are representative category serving suggestions, not photographs of La Pizza's actual dishes. Replace each URL with a dish-specific photo (for example `assets/images/margherita.webp`) and update its alt text when restaurant photography is available. Cards lazy-load images, reserve image space, and fall back to a local illustration on load failure.

Customers can switch between image grid and compact image list layouts. V2 opens in list view. The preference is remembered locally using `lapizza-v2-menu-view`; filters and search remain active when switching. Layout behavior lives in `src/menu/layout.js`.

## UI versions

The project root is the active V2 workspace. The previous UI is preserved in [the V1 archive](versions/ui-v1.zip). See [VERSION.md](VERSION.md) for snapshot verification and preview instructions.

V2 opens directly to the menu with category sections, serif headings, thumbnail photos, and prices. The hero carousel is inactive so dishes appear immediately. V1 remains preserved in its archive.

## Book cover

The optional V2 cover uses the original Illustrator artwork rendered locally as `assets/images/menu-cover.png`. The cuisine label is a native text overlay. Tap anywhere on the cover, swipe left, press Enter/Space on it, or use the left arrow to open. The opened menu starts directly with search and dish content, without the former brand bar or introduction. The modal keeps keyboard focus out of the menu until opened; reduced-motion preferences skip the turn animation. Gesture and focus behavior lives in `src/book/cover.js`.

## Switching UI versions

The top preview navigation links to UI V1 (`versions/v1/index.html`) and UI V2 (`index.html`), including from the V2 cover. `versions/v1/` is an extracted preview of the saved snapshot with only the shared version navigation added. The original ZIP and checksum manifest remain untouched. Serve the entire project root so both versions and the shared switcher assets are available.

V2 categories appear as continuous colored index strips attached to the right page edge, inspired by printed report dividers. Vertical labels, distinct category colors, and an inset selection marker keep the index compact. The rail stays visible while scrolling within the menu. Choosing a tab filters dishes and returns to the menu heading. V1 keeps its original navigation.

Category selection animates the V2 page around its left spine before revealing the chosen category. `src/book/page-turn.js` serializes turns, keeps the latest pending tab choice, restores interaction after cancellation, and skips motion when requested by the customer's accessibility settings.

Category turns last 1.05 seconds. The incoming page renders immediately under an inert visual snapshot of the outgoing page, so it stays visible while the old sheet opens. Snapshots are removed after completion or cancellation and do not duplicate IDs or interactive controls in the accessibility tree.

V2 opens with the menu cover by default. Tap or swipe left to open the menu. The UI preview switcher is hidden in the main entry page; V1 remains available at `versions/v1/index.html`.
