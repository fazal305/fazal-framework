(function (window) {
    "use strict";

    const routes = [];
    const routeListeners = new Set();

    let currentRoute = {
        path: "",
        params: {}
    };

    function normalizePath(path) {
        if (!path || path === "#") {
            return "/";
        }

        return path.replace(/^#/, "").replace(/^\/?/, "/");
    }

    function parseRoutePattern(pattern) {
        const keys = [];
        const regexSource = normalizePath(pattern)
            .split("/")
            .map(function (segment) {
                if (segment.startsWith(":")) {
                    keys.push(segment.slice(1));
                    return "([^/]+)";
                }

                return segment;
            })
            .join("/");

        return {
            keys: keys,
            regex: new RegExp("^" + regexSource + "$")
        };
    }

    function register(path, handler) {
        if (typeof path !== "string" || typeof handler !== "function") {
            throw new Error("FazalRouter.register(path, handler) requires a string path and function handler.");
        }

        const parsed = parseRoutePattern(path);

        routes.push({
            path: normalizePath(path),
            handler: handler,
            keys: parsed.keys,
            regex: parsed.regex
        });

        return window.FazalRouter;
    }

    function findRoute(path) {
        const normalizedPath = normalizePath(path);

        for (let index = 0; index < routes.length; index += 1) {
            const route = routes[index];
            const match = normalizedPath.match(route.regex);

            if (match) {
                const params = {};

                route.keys.forEach(function (key, keyIndex) {
                    params[key] = decodeURIComponent(match[keyIndex + 1]);
                });

                return {
                    route: route,
                    path: normalizedPath,
                    params: params
                };
            }
        }

        return null;
    }

    function dispatch(path) {
        const targetPath = normalizePath(path);
        const match = findRoute(targetPath);

        if (!match) {
            return false;
        }

        if (window.FazalPlugins && window.FazalPlugins.runHook) {
            window.FazalPlugins.runHook("beforeRouteChange", {
                path: match.path,
                params: match.params
            });
        }

        currentRoute = {
            path: match.path,
            params: Object.assign({}, match.params)
        };

        match.route.handler(match.params);

        routeListeners.forEach(function (listener) {
            listener(getCurrentRoute());
        });

        if (window.FazalEventBus) {
            window.FazalEventBus.emit("routechange", getCurrentRoute());
        }

        return true;
    }

    function navigate(path) {
        const normalizedPath = normalizePath(path);

        if (window.location.hash === "#" + normalizedPath) {
            dispatch(normalizedPath);
            return;
        }

        window.location.hash = normalizedPath;
    }

    function start() {
        window.addEventListener("hashchange", function () {
            dispatch(window.location.hash);
        });

        dispatch(window.location.hash || "/");
    }

    function onRouteChange(listener) {
        if (typeof listener !== "function") {
            throw new Error("FazalRouter.onRouteChange(listener) requires a function.");
        }

        routeListeners.add(listener);

        return function unsubscribe() {
            routeListeners.delete(listener);
        };
    }

    function getCurrentRoute() {
        return {
            path: currentRoute.path,
            params: Object.assign({}, currentRoute.params)
        };
    }

    window.FazalRouter = {
        register: register,
        navigate: navigate,
        start: start,
        onRouteChange: onRouteChange,
        getCurrentRoute: getCurrentRoute
    };
})(window);