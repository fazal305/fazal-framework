(function (window, document, $) {
    "use strict";

    const Framework = window.FazalFramework;
    const Shared = window.FazalShared;
    const persistenceKey = "fazal-framework-plugin-demo-store";

    const pluginStore = Framework.State.createStore({
        score: 0,
        lastAction: "Initialized"
    });

    const pluginConfigs = [
        {
            name: "Logger Plugin",
            description: "Logs route, state, and component hook activity into this page."
        },
        {
            name: "Persistence Plugin",
            description: "Auto-saves this demo store to localStorage while enabled."
        }
    ];

    function addPluginLog(title, detail) {
        document.getElementById("pluginLog").insertAdjacentHTML(
            "afterbegin",
            [
                '<div class="plugin-log-entry">',
                "<strong>" + Shared.escapeHtml(title) + "</strong>",
                '<div class="muted">' + Shared.formatTimestamp(new Date().toISOString()) + "</div>",
                "<p class='mb-0'>" + Shared.escapeHtml(detail) + "</p>",
                "</div>"
            ].join("")
        );
    }

    function renderPluginControls() {
        const activePlugins = Framework.Plugins.list().map(function (plugin) {
            return plugin.name;
        });

        document.getElementById("pluginControls").innerHTML = pluginConfigs
            .map(function (plugin) {
                const enabled = activePlugins.includes(plugin.name);

                return [
                    '<article class="plugin-card ' + (enabled ? "plugin-enabled" : "") + '">',
                    "<div>",
                    "<h3>" + Shared.escapeHtml(plugin.name) + "</h3>",
                    '<p class="muted mb-0">' + Shared.escapeHtml(plugin.description) + "</p>",
                    "</div>",
                    '<button class="' + (enabled ? "btn-ghost" : "btn-theme") + '" data-plugin-toggle="' + Shared.escapeHtml(plugin.name) + '">',
                    enabled ? "Disable Plugin" : "Enable Plugin",
                    "</button>",
                    "</article>"
                ].join("");
            })
            .join("");
    }

    function renderPluginList() {
        document.getElementById("pluginList").textContent = JSON.stringify(Framework.Plugins.list(), null, 2);
    }

    function renderStore() {
        document.getElementById("pluginStoreValue").textContent = pluginStore.getState().score;
    }

    function refreshUi() {
        renderPluginControls();
        renderPluginList();
        renderStore();
    }

    function createLoggerPlugin() {
        return {
            name: "Logger Plugin",
            install: function () {
                addPluginLog("Logger installed", "Logger Plugin is now listening to framework hooks.");

                return function cleanup() {
                    addPluginLog("Logger cleaned up", "Logger Plugin cleanup function ran.");
                };
            },
            hooks: {
                beforeRouteChange: function (payload) {
                    addPluginLog("beforeRouteChange", "Route target: " + payload.path);
                },
                onStateChange: function (payload) {
                    addPluginLog("onStateChange", "Store changed: " + JSON.stringify(payload.nextState));
                },
                onComponentMount: function (payload) {
                    addPluginLog("onComponentMount", "Mounted component: " + payload.name);
                }
            }
        };
    }

    function createPersistencePlugin() {
        return {
            name: "Persistence Plugin",
            install: function () {
                const unsubscribe = pluginStore.subscribe(function (nextState) {
                    localStorage.setItem(persistenceKey, JSON.stringify(nextState));
                    addPluginLog("Persistence saved", "Saved store snapshot to localStorage.");
                });

                addPluginLog("Persistence installed", "Store changes will now be saved.");

                return function cleanup() {
                    unsubscribe();
                    addPluginLog("Persistence cleaned up", "Store auto-save has stopped.");
                };
            },
            hooks: {}
        };
    }

    function enablePlugin(pluginName) {
        if (pluginName === "Logger Plugin") {
            Framework.Plugins.register(createLoggerPlugin());
        }

        if (pluginName === "Persistence Plugin") {
            Framework.Plugins.register(createPersistencePlugin());
        }

        Shared.addActivityLog("Plugin Demo", "Plugin enabled", pluginName + " was registered.");
        refreshUi();
    }

    function disablePlugin(pluginName) {
        Framework.Plugins.unregister(pluginName);
        Shared.addActivityLog("Plugin Demo", "Plugin disabled", pluginName + " was unregistered.");
        refreshUi();
    }

    function togglePlugin(pluginName) {
        const isEnabled = Framework.Plugins.list().some(function (plugin) {
            return plugin.name === pluginName;
        });

        if (isEnabled) {
            disablePlugin(pluginName);
        } else {
            enablePlugin(pluginName);
        }
    }

    function updateStore(delta) {
        const state = pluginStore.getState();

        pluginStore.setState({
            score: state.score + delta,
            lastAction: delta > 0 ? "Increased" : "Decreased"
        });

        Framework.Plugins.runHook("onStateChange", {
            storeName: "plugin-demo-store",
            nextState: pluginStore.getState(),
            previousState: state
        });

        refreshUi();
    }

    function triggerRouteHook() {
        Framework.Plugins.runHook("beforeRouteChange", {
            path: "/plugin-demo/manual-hook",
            params: {
                source: "button"
            }
        });
    }

    function loadPersistedStore() {
        try {
            const stored = localStorage.getItem(persistenceKey);

            if (stored) {
                pluginStore.setState(JSON.parse(stored));
            }
        } catch (error) {
            addPluginLog("Persistence load failed", "Stored JSON could not be parsed.");
        }
    }

    function bindEvents() {
        $("#pluginControls").on("click", "[data-plugin-toggle]", function () {
            togglePlugin($(this).attr("data-plugin-toggle"));
        });

        $("#increaseStoreBtn").on("click", function () {
            updateStore(1);
        });

        $("#decreaseStoreBtn").on("click", function () {
            updateStore(-1);
        });

        $("#triggerRouteHookBtn").on("click", triggerRouteHook);
    }

    function initPluginDemo() {
        Shared.initSharedPage("plugins");

        loadPersistedStore();
        bindEvents();
        refreshUi();

        Shared.addActivityLog(
            "Plugin Demo",
            "Plugin sandbox initialized",
            "Logger and Persistence plugins are available but disabled by default."
        );
    }

    document.addEventListener("DOMContentLoaded", initPluginDemo);
})(window, document, jQuery);