# La Pizza digital menu

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
- `src/carousel/index.js`: featured category carousel, communicating through a callback.
- `menu.json`: menu content; existing dish IDs must remain stable to preserve favourites.

Keep dish content in JSON and render it with `textContent`. Carousel HTML/SVG strings are trusted source code and must never be populated from user input or menu data. New behavior should live in its owning feature; features communicate through explicit callbacks rather than global variables.

## Menu updates and deployment

Each dish requires a unique nonempty `id`, a `category`, a `name`, a string `description` (which may be empty), and a finite nonnegative numeric `price` in USD. Run `npm test` after editing the menu.

Deploy the project directory to any static HTTP host, including all files in `src/` and `menu.json`. There is no backend, ordering system, or secret configuration. Favourites are stored locally in the customer's browser and remain usable in memory when storage is unavailable. Fonts currently load from Google Fonts with system fallbacks.

Before release, check search, combined category/favourites filters, empty results, reload persistence, dish dialogs, carousel controls and swipe, keyboard navigation, and mobile layout in a browser.

## Product photos

Each dish has an `image` URL and descriptive `imageAlt` in `menu.json`. The initial Unsplash photos are representative category serving suggestions, not photographs of La Pizza's actual dishes. Replace each URL with a dish-specific photo (for example `assets/images/margherita.webp`) and update its alt text when restaurant photography is available. Cards lazy-load images, reserve image space, and fall back to a local illustration on load failure.

Customers can switch between image grid and compact image list layouts. The preference is remembered locally using `lapizza-menu-view`; filters and search remain active when switching. Layout behavior lives in `src/menu/layout.js`.
