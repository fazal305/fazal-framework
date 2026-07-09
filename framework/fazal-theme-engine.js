(function (window, document) {
    "use strict";

    const storageKey = "fazal-framework-theme";

    const tokens = {
        bg: "#0b1020",
        "bg-soft": "#111936",
        card: "#16213f",
        text: "#eef3ff",
        muted: "#95a3c7",
        primary: "#6c8cff",
        secondary: "#8b5cf6",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        radius: "18px",
        "font-family": "Inter, system-ui, sans-serif"
    };

    let currentTheme = loadStoredTheme();

    function loadStoredTheme() {
        try {
            const stored = localStorage.getItem(storageKey);

            if (!stored) {
                return Object.assign({}, tokens);
            }

            return Object.assign({}, tokens, JSON.parse(stored));
        } catch (error) {
            return Object.assign({}, tokens);
        }
    }

    function registerToken(name, defaultValue) {
        if (!name || typeof name !== "string") {
            throw new Error("FazalTheme.registerToken(name, defaultValue) requires a token name.");
        }

        tokens[name] = defaultValue;
        currentTheme[name] = currentTheme[name] || defaultValue;

        document.documentElement.style.setProperty("--" + name, currentTheme[name]);

        return getTheme();
    }

    function applyTheme(themeObject) {
        const nextTheme = Object.assign({}, currentTheme, themeObject || {});

        Object.keys(tokens).forEach(function (tokenName) {
            const value = nextTheme[tokenName] || tokens[tokenName];
            nextTheme[tokenName] = value;
            document.documentElement.style.setProperty("--" + tokenName, value);
        });

        currentTheme = nextTheme;

        try {
            localStorage.setItem(storageKey, JSON.stringify(currentTheme));
        } catch (error) {
            console.warn("FazalTheme could not persist theme:", error);
        }

        if (window.FazalEventBus) {
            window.FazalEventBus.emit("themechange", getTheme());
        }

        return getTheme();
    }

    function getTheme() {
        return Object.assign({}, currentTheme);
    }

    function onThemeChange(listener) {
        if (typeof listener !== "function") {
            throw new Error("FazalTheme.onThemeChange(listener) requires a function.");
        }

        if (!window.FazalEventBus) {
            return function noop() { };
        }

        return window.FazalEventBus.on("themechange", function (event) {
            listener(event.payload);
        });
    }

    window.FazalTheme = {
        storageKey: storageKey,
        registerToken: registerToken,
        applyTheme: applyTheme,
        getTheme: getTheme,
        onThemeChange: onThemeChange
    };

    applyTheme(currentTheme);
})(window, document);