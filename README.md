# Fazal Framework

A tiny, real, dependency-free frontend framework — Router, Component
system, State management, Event Bus, Theme Engine, and Plugin system —
plus a documentation/demo site that runs on top of it and proves every
piece actually works.

## Live Links

- GitHub Repository: [fazal305/fazal-framework](https://github.com/fazal305/fazal-framework)
- Live Demo: [https://fazal305.github.io/fazal-framework/](https://fazal305.github.io/fazal-framework/)

## Overview

Fazal Framework is a small browser-based frontend framework built with
dependency-free vanilla JavaScript. It is designed to run locally by opening
`index.html`, while still proving real framework concepts such as routing,
components, state management, pub/sub communication, theming, and plugins.

The included documentation/demo site is built around the framework itself,
so every subsystem is demonstrated live instead of only being described.

## Modules

- **Router** — hash-based client-side router with route params and route-change hooks
- **Component System** — define, mount, update, and destroy small stateful components
- **State Management** — independent observable stores with `getState`, `setState`, and `subscribe`
- **Event Bus** — pub/sub system with `on`, `off`, `once`, `emit`, and named buses
- **Theme Engine** — runtime CSS custom-property theming with localStorage persistence
- **Plugin System** — plugin registry with install functions and hook execution

## Pages

- **Dashboard** — overview and live framework module status
- **Router Demo** — mini single-page hash router inside one page
- **Component Demo** — independent stateful component instances
- **State Demo** — shared observable store connected to multiple panels
- **Event Bus Demo** — decoupled publisher/subscriber communication
- **Theme Engine Demo** — live editable theme tokens
- **Plugin Demo** — logger and persistence plugin sandbox
- **API Documentation** — real API reference for all framework modules
- **Case Studies** — migration illustrations for existing projects
- **Settings** — workspace, transition, theme, export/import, and reset controls

## Features

- Runs locally with plain HTML, CSS, and JavaScript
- No build tools, no bundlers, no ES modules
- Dependency-free framework core
- Bootstrap and jQuery used only for demo-site chrome
- Classic global namespace API through `window.FazalFramework`
- Separate framework modules
- Separate HTML, CSS, and JS file for every page
- Dynamic theme engine powered by CSS custom properties
- Smooth page transitions with loader fallback
- localStorage persistence for theme and workspace data
- Responsive documentation-style layout

## Technologies Used

- HTML5
- CSS3 dynamic custom properties
- Bootstrap 5 (demo site chrome only)
- jQuery (demo site chrome only)
- Vanilla JavaScript (the framework itself has zero dependencies)
- LocalStorage
- Blob API

## Learning Outcomes

- Built a small framework-style architecture from scratch
- Implemented a hash router with named params
- Created a minimal stateful component system
- Built independent observable stores
- Used pub/sub architecture for decoupled communication
- Designed a reusable runtime theme engine
- Added a plugin/hook mechanism
- Practiced no-build browser architecture
- Created a documentation/demo site that proves real behavior

## Architecture Notes

Fazal Framework uses classic global-namespace scripts instead of native ES
modules because this project is designed to work by opening `index.html`
directly from the file system. Native module imports can fail under `file://`
because of browser CORS restrictions, so the framework is loaded through
regular `<script src="..."></script>` tags.

The framework files must load in this order:

1. `framework/fazal-event-bus.js`
2. `framework/fazal-state.js`
3. `framework/fazal-theme-engine.js`
4. `framework/fazal-router.js`
5. `framework/fazal-component.js`
6. `framework/fazal-plugin-system.js`
7. `framework/fazal-framework.js`

`EventBus` and `State` have no dependencies. `Theme` depends on `EventBus`
to emit `themechange`. `Router` and `Component` can emit framework activity
events. `Plugins` depends on the full framework surface because plugins can
hook into routing, state, components, events, and theme behavior.

The framework Router is demonstrated inside `router-demo.html` as a mini
single-page application. The documentation site itself remains a classic
multi-page site so every module can have its own HTML, CSS, and JS file.

The Settings page dogfoods the framework by using `FazalFramework.Theme` as
the real theme source for the entire demo site. Theme data and site workspace
data are stored separately so the framework remains reusable outside this
specific demo.

## Folder Structure

```text
fazal-framework/
  index.html
  router-demo.html
  component-demo.html
  state-demo.html
  event-bus-demo.html
  theme-engine-demo.html
  plugin-demo.html
  api-docs.html
  case-studies.html
  settings.html

  styles.css

  css/
    dashboard.css
    router-demo.css
    component-demo.css
    state-demo.css
    event-bus-demo.css
    theme-engine-demo.css
    plugin-demo.css
    api-docs.css
    case-studies.css
    settings.css

  framework/
    fazal-event-bus.js
    fazal-state.js
    fazal-theme-engine.js
    fazal-router.js
    fazal-component.js
    fazal-plugin-system.js
    fazal-framework.js

  js/
    shared.js
    dashboard.js
    router-demo.js
    component-demo.js
    state-demo.js
    event-bus-demo.js
    theme-engine-demo.js
    plugin-demo.js
    api-docs.js
    case-studies.js
    settings.js

  README.md
  LICENSE
  .gitignore
```

How To Run Locally
git clone https://github.com/fazal305/fazal-framework.git
cd fazal-framework

Then open:

index.html

No build command is required.

Sample Workflow
Open the Dashboard and confirm all six framework modules are loaded.
Open Router Demo and navigate the mini single-page router.
Open Component Demo and mount another independent counter instance.
Open State Demo and watch both panels stay synced through one store.
Open Event Bus Demo and publish events to a decoupled subscriber.
Open Theme Engine Demo and change the live theme tokens.
Open Plugin Demo and toggle Logger and Persistence plugins.
Open API Docs and review the real framework API.
Open Case Studies and read the migration plan.
Open Settings and export/import or reset the site workspace.
