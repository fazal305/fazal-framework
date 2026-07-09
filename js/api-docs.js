(function (window, document) {
    "use strict";

    const Shared = window.FazalShared;

    const apiDocs = [
        {
            id: "event-bus",
            module: "EventBus",
            description: "A tiny pub/sub system for decoupled communication.",
            methods: [
                {
                    signature: "EventBus.on(eventName, handler)",
                    description: "Subscribes to an event and returns an unsubscribe function.",
                    example: "const off = FazalFramework.EventBus.on('saved', function(event) {\n  console.log(event.payload);\n});"
                },
                {
                    signature: "EventBus.off(eventName, handler)",
                    description: "Removes a specific handler from an event.",
                    example: "FazalFramework.EventBus.off('saved', handler);"
                },
                {
                    signature: "EventBus.once(eventName, handler)",
                    description: "Runs a handler only once, then automatically unsubscribes.",
                    example: "FazalFramework.EventBus.once('ready', function(event) {\n  console.log('Ready once');\n});"
                },
                {
                    signature: "EventBus.emit(eventName, payload)",
                    description: "Publishes an event payload to all active subscribers.",
                    example: "FazalFramework.EventBus.emit('saved', { id: 1 });"
                },
                {
                    signature: "EventBus.create(namespace)",
                    description: "Creates an independent named event bus.",
                    example: "const editorBus = FazalFramework.EventBus.create('editor');"
                }
            ]
        },
        {
            id: "state",
            module: "State",
            description: "Independent observable stores with shallow state merging.",
            methods: [
                {
                    signature: "State.createStore(initialState)",
                    description: "Creates a store with getState, setState, and subscribe.",
                    example: "const store = FazalFramework.State.createStore({ count: 0 });"
                },
                {
                    signature: "store.getState()",
                    description: "Returns a shallow copy of the current store state.",
                    example: "const current = store.getState();"
                },
                {
                    signature: "store.setState(partialState)",
                    description: "Shallow-merges new state and notifies subscribers only when values changed.",
                    example: "store.setState({ count: store.getState().count + 1 });"
                },
                {
                    signature: "store.subscribe(listener)",
                    description: "Subscribes to state changes and returns an unsubscribe function.",
                    example: "const off = store.subscribe(function(next, previous) {\n  console.log(next, previous);\n});"
                }
            ]
        },
        {
            id: "theme",
            module: "Theme",
            description: "Runtime CSS custom-property theming with localStorage persistence.",
            methods: [
                {
                    signature: "Theme.registerToken(name, defaultValue)",
                    description: "Registers a new CSS token and applies it as --name.",
                    example: "FazalFramework.Theme.registerToken('accent', '#6c8cff');"
                },
                {
                    signature: "Theme.applyTheme(themeObject)",
                    description: "Applies tokens to :root, persists them, and emits themechange.",
                    example: "FazalFramework.Theme.applyTheme({ primary: '#7c3aed' });"
                },
                {
                    signature: "Theme.getTheme()",
                    description: "Returns the active theme object.",
                    example: "const theme = FazalFramework.Theme.getTheme();"
                },
                {
                    signature: "Theme.onThemeChange(listener)",
                    description: "Listens for live theme changes through EventBus interop.",
                    example: "FazalFramework.Theme.onThemeChange(function(theme) {\n  console.log(theme.primary);\n});"
                }
            ]
        },
        {
            id: "router",
            module: "Router",
            description: "A hash router with params and route-change hooks.",
            methods: [
                {
                    signature: "Router.register(path, handler)",
                    description: "Registers a static or param route like /product/:id.",
                    example: "FazalFramework.Router.register('/user/:id', function(params) {\n  console.log(params.id);\n});"
                },
                {
                    signature: "Router.navigate(path)",
                    description: "Changes the hash and dispatches the matching route.",
                    example: "FazalFramework.Router.navigate('/user/42');"
                },
                {
                    signature: "Router.start()",
                    description: "Starts listening to hashchange and dispatches the current hash.",
                    example: "FazalFramework.Router.start();"
                },
                {
                    signature: "Router.onRouteChange(listener)",
                    description: "Runs on every successful route dispatch.",
                    example: "FazalFramework.Router.onRouteChange(function(route) {\n  console.log(route.path, route.params);\n});"
                },
                {
                    signature: "Router.getCurrentRoute()",
                    description: "Returns the active route path and params.",
                    example: "const route = FazalFramework.Router.getCurrentRoute();"
                }
            ]
        },
        {
            id: "component",
            module: "Component",
            description: "Minimal stateful components with render and lifecycle hooks.",
            methods: [
                {
                    signature: "Component.define(name, config)",
                    description: "Defines a component with initialState, render, and optional hooks.",
                    example: "FazalFramework.Component.define('Counter', {\n  initialState: { count: 0 },\n  render: function(props, state) {\n    return '<button>' + state.count + '</button>';\n  }\n});"
                },
                {
                    signature: "Component.mount(name, targetEl, props)",
                    description: "Mounts a component instance into a DOM target.",
                    example: "const instance = FazalFramework.Component.mount('Counter', el, { title: 'A' });"
                },
                {
                    signature: "instance.setState(partialState)",
                    description: "Updates internal component state and re-renders.",
                    example: "instance.setState({ count: 2 });"
                },
                {
                    signature: "instance.destroy()",
                    description: "Runs onDestroy and removes the instance from the DOM.",
                    example: "instance.destroy();"
                },
                {
                    signature: "Component.listDefinitions()",
                    description: "Returns names of registered component definitions.",
                    example: "console.log(FazalFramework.Component.listDefinitions());"
                }
            ]
        },
        {
            id: "plugins",
            module: "Plugins",
            description: "A simple plugin registry with install functions and hooks.",
            methods: [
                {
                    signature: "Plugins.register(plugin)",
                    description: "Registers and installs a plugin immediately.",
                    example: "FazalFramework.Plugins.register({\n  name: 'Logger',\n  install: function(framework) {},\n  hooks: {}\n});"
                },
                {
                    signature: "Plugins.unregister(name)",
                    description: "Disables a plugin and runs cleanup when available.",
                    example: "FazalFramework.Plugins.unregister('Logger');"
                },
                {
                    signature: "Plugins.list()",
                    description: "Returns active plugins and enabled state.",
                    example: "console.log(FazalFramework.Plugins.list());"
                },
                {
                    signature: "Plugins.runHook(hookName, payload)",
                    description: "Runs matching hook handlers on enabled plugins.",
                    example: "FazalFramework.Plugins.runHook('onStateChange', { nextState: {} });"
                }
            ]
        }
    ];

    function renderNav() {
        document.getElementById("docsNav").innerHTML = apiDocs
            .map(function (section) {
                return '<a class="docs-link" href="#' + section.id + '">' + section.module + "</a>";
            })
            .join("");
    }

    function renderMethod(method) {
        return [
            '<article class="card-panel method-card">',
            '<div class="method-signature">' + Shared.escapeHtml(method.signature) + "</div>",
            '<p class="muted">' + Shared.escapeHtml(method.description) + "</p>",
            "<pre><code>" + Shared.escapeHtml(method.example) + "</code></pre>",
            "</article>"
        ].join("");
    }

    function renderDocs() {
        document.getElementById("docsContent").innerHTML = apiDocs
            .map(function (section) {
                return [
                    '<section id="' + section.id + '" class="mb-4">',
                    '<div class="card-panel mb-3">',
                    "<h2>" + Shared.escapeHtml(section.module) + "</h2>",
                    '<p class="muted mb-0">' + Shared.escapeHtml(section.description) + "</p>",
                    "</div>",
                    section.methods.map(renderMethod).join(""),
                    "</section>"
                ].join("");
            })
            .join("");
    }

    function initApiDocs() {
        Shared.initSharedPage("apiDocs");
        renderNav();
        renderDocs();

        Shared.addActivityLog(
            "API Docs",
            "Documentation opened",
            "Generated API reference from the implemented framework surface."
        );
    }

    document.addEventListener("DOMContentLoaded", initApiDocs);
})(window, document);