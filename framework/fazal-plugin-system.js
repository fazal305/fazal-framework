(function (window) {
    "use strict";

    const plugins = {};

    function getFramework() {
        return window.FazalFramework || {
            Router: window.FazalRouter,
            Component: window.FazalComponent,
            State: window.FazalState,
            EventBus: window.FazalEventBus,
            Theme: window.FazalTheme,
            Plugins: window.FazalPlugins
        };
    }

    function register(plugin) {
        if (!plugin || !plugin.name) {
            throw new Error("FazalPlugins.register(plugin) requires a plugin with a name.");
        }

        if (plugins[plugin.name]) {
            unregister(plugin.name);
        }

        plugins[plugin.name] = {
            name: plugin.name,
            enabled: true,
            install: plugin.install,
            hooks: plugin.hooks || {},
            cleanup: null
        };

        if (typeof plugin.install === "function") {
            const cleanup = plugin.install(getFramework());

            if (typeof cleanup === "function") {
                plugins[plugin.name].cleanup = cleanup;
            }
        }

        if (window.FazalEventBus) {
            window.FazalEventBus.emit("pluginregister", {
                name: plugin.name
            });
        }

        return plugins[plugin.name];
    }

    function unregister(name) {
        const plugin = plugins[name];

        if (!plugin) {
            return false;
        }

        if (typeof plugin.cleanup === "function") {
            plugin.cleanup();
        }

        plugin.enabled = false;

        if (window.FazalEventBus) {
            window.FazalEventBus.emit("pluginunregister", {
                name: name
            });
        }

        delete plugins[name];

        return true;
    }

    function runHook(hookName, payload) {
        Object.keys(plugins).forEach(function (pluginName) {
            const plugin = plugins[pluginName];

            if (
                plugin.enabled &&
                plugin.hooks &&
                typeof plugin.hooks[hookName] === "function"
            ) {
                plugin.hooks[hookName](payload, getFramework());
            }
        });
    }

    function list() {
        return Object.keys(plugins).map(function (pluginName) {
            return {
                name: plugins[pluginName].name,
                enabled: plugins[pluginName].enabled
            };
        });
    }

    window.FazalPlugins = {
        register: register,
        unregister: unregister,
        runHook: runHook,
        list: list
    };
})(window);