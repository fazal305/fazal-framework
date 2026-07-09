(function (window, document) {
    "use strict";

    const moduleChecks = [
        {
            name: "Event Bus",
            key: "EventBus",
            test: function (framework) {
                return Boolean(framework.EventBus && framework.EventBus.on && framework.EventBus.emit);
            }
        },
        {
            name: "State",
            key: "State",
            test: function (framework) {
                return Boolean(framework.State && framework.State.createStore);
            }
        },
        {
            name: "Theme Engine",
            key: "Theme",
            test: function (framework) {
                return Boolean(framework.Theme && framework.Theme.applyTheme && framework.Theme.getTheme);
            }
        },
        {
            name: "Router",
            key: "Router",
            test: function (framework) {
                return Boolean(framework.Router && framework.Router.register && framework.Router.navigate);
            }
        },
        {
            name: "Component",
            key: "Component",
            test: function (framework) {
                return Boolean(framework.Component && framework.Component.define && framework.Component.mount);
            }
        },
        {
            name: "Plugin System",
            key: "Plugins",
            test: function (framework) {
                return Boolean(framework.Plugins && framework.Plugins.register && framework.Plugins.unregister);
            }
        }
    ];

    const quickActions = [
        {
            title: "Router Demo",
            url: "router-demo.html",
            module: "Router",
            description: "Test hash navigation, params, and route-change hooks."
        },
        {
            title: "Component Demo",
            url: "component-demo.html",
            module: "Component",
            description: "Mount counters and todos with independent internal state."
        },
        {
            title: "State Demo",
            url: "state-demo.html",
            module: "State",
            description: "Watch multiple panels react to one observable store."
        },
        {
            title: "Event Bus Demo",
            url: "event-bus-demo.html",
            module: "EventBus",
            description: "Publish events and watch decoupled subscribers react."
        },
        {
            title: "Theme Engine Demo",
            url: "theme-engine-demo.html",
            module: "Theme",
            description: "Edit CSS tokens live and persist them through localStorage."
        },
        {
            title: "Plugin Demo",
            url: "plugin-demo.html",
            module: "Plugins",
            description: "Toggle real plugins and see hooks change behavior."
        },
        {
            title: "API Documentation",
            url: "api-docs.html",
            module: "Docs",
            description: "Read the real API surface implemented in this project."
        },
        {
            title: "Case Studies",
            url: "case-studies.html",
            module: "Migration",
            description: "See how existing studio patterns could migrate to this framework."
        },
        {
            title: "Settings",
            url: "settings.html",
            module: "Theme + Workspace",
            description: "Manage site settings, transitions, theme, export, and reset."
        }
    ];

    function renderModuleStatus() {
        const framework = window.FazalFramework || {};
        const container = document.getElementById("moduleStatus");

        container.innerHTML = moduleChecks
            .map(function (item) {
                const ready = item.test(framework);

                return [
                    '<div class="status-row">',
                    "<div>",
                    "<strong>" + item.name + "</strong>",
                    '<div class="muted">FazalFramework.' + item.key + "</div>",
                    "</div>",
                    '<span class="status-dot ' + (ready ? "ready" : "") + '"></span>',
                    "</div>"
                ].join("");
            })
            .join("");
    }

    function renderActivityLog() {
        const workspace = window.FazalShared.loadWorkspace();
        const log = workspace.activityLog.slice(0, 5);

        document.getElementById("activityLog").innerHTML = log
            .map(function (entry) {
                return [
                    '<div class="event-entry">',
                    "<strong>" + window.FazalShared.escapeHtml(entry.action) + "</strong>",
                    '<div class="muted">' + window.FazalShared.escapeHtml(entry.module) + " • " + window.FazalShared.formatTimestamp(entry.createdAt) + "</div>",
                    "<p class='mb-0'>" + window.FazalShared.escapeHtml(entry.detail) + "</p>",
                    "</div>"
                ].join("");
            })
            .join("");
    }

    function renderQuickActions() {
        document.getElementById("quickActions").innerHTML = quickActions
            .map(function (item, index) {
                return [
                    '<a class="card-panel quick-card" href="' + item.url + '">',
                    "<div>",
                    '<span class="module-number">0' + (index + 1) + "</span>",
                    "<h3>" + item.title + "</h3>",
                    '<p class="muted">' + item.description + "</p>",
                    "</div>",
                    '<span class="badge-soft">' + item.module + "</span>",
                    "</a>"
                ].join("");
            })
            .join("");
    }

    function initDashboard() {
        window.FazalShared.initSharedPage("dashboard");

        renderModuleStatus();
        renderActivityLog();
        renderQuickActions();

        window.FazalShared.addActivityLog(
            "Dashboard",
            "Checked framework modules",
            "Dashboard verified the six framework modules from real window.FazalFramework globals."
        );
    }

    document.addEventListener("DOMContentLoaded", initDashboard);
})(window, document);