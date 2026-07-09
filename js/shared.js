(function (window, document, $) {
    "use strict";

    const workspaceKey = "fazal-framework-workspace";

    const siteConfig = {
        defaultWorkspace: {
            settings: {
                compactSidebar: false,
                transitionSpeedMs: 320,
                loaderDelayMs: 180
            },
            activityLog: [
                {
                    id: "log-starter",
                    module: "Dashboard",
                    action: "Workspace initialized",
                    detail: "Fazal Framework demo site loaded with separate workspace and theme storage.",
                    createdAt: new Date().toISOString()
                }
            ]
        },
        pages: [
            { id: "dashboard", label: "Dashboard", icon: "🏠", url: "index.html" },
            { id: "router", label: "Router Demo", icon: "🧭", url: "router-demo.html" },
            { id: "component", label: "Component Demo", icon: "🧩", url: "component-demo.html" },
            { id: "state", label: "State Demo", icon: "📦", url: "state-demo.html" },
            { id: "eventBus", label: "Event Bus Demo", icon: "📡", url: "event-bus-demo.html" },
            { id: "theme", label: "Theme Engine", icon: "🎨", url: "theme-engine-demo.html" },
            { id: "plugins", label: "Plugin Demo", icon: "🔌", url: "plugin-demo.html" },
            { id: "apiDocs", label: "API Docs", icon: "📚", url: "api-docs.html" },
            { id: "caseStudies", label: "Case Studies", icon: "🧪", url: "case-studies.html" },
            { id: "settings", label: "Settings", icon: "⚙️", url: "settings.html" }
        ]
    };

    let overlayTimer = null;

    function generateId(prefix) {
        return (prefix || "id") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function formatTimestamp(dateString) {
        const date = dateString ? new Date(dateString) : new Date();

        return date.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    function cloneDefaultWorkspace() {
        return JSON.parse(JSON.stringify(siteConfig.defaultWorkspace));
    }

    function loadWorkspace() {
        try {
            const stored = localStorage.getItem(workspaceKey);

            if (!stored) {
                return cloneDefaultWorkspace();
            }

            return Object.assign(cloneDefaultWorkspace(), JSON.parse(stored));
        } catch (error) {
            return cloneDefaultWorkspace();
        }
    }

    function saveWorkspace(workspace) {
        localStorage.setItem(workspaceKey, JSON.stringify(workspace));
        return workspace;
    }

    function resetWorkspace() {
        const freshWorkspace = cloneDefaultWorkspace();
        saveWorkspace(freshWorkspace);
        return freshWorkspace;
    }

    function addActivityLog(module, action, detail) {
        const workspace = loadWorkspace();

        workspace.activityLog.unshift({
            id: generateId("log"),
            module: module,
            action: action,
            detail: detail,
            createdAt: new Date().toISOString()
        });

        workspace.activityLog = workspace.activityLog.slice(0, 80);
        saveWorkspace(workspace);

        return workspace.activityLog[0];
    }

    function renderSidebar(activePage) {
        const workspace = loadWorkspace();
        const compactClass = workspace.settings.compactSidebar ? " compact" : "";

        const navHtml = siteConfig.pages
            .map(function (page) {
                const activeClass = page.id === activePage ? " active" : "";

                return [
                    '<a class="nav-link' + activeClass + '" href="' + page.url + '" data-page-id="' + page.id + '">',
                    '<span class="nav-icon">' + page.icon + "</span>",
                    '<span class="nav-label">' + page.label + "</span>",
                    "</a>"
                ].join("");
            })
            .join("");

        return [
            '<aside class="sidebar' + compactClass + '" id="appSidebar">',
            '<div class="brand">',
            '<div class="brand-mark">FF</div>',
            '<div class="brand-text">',
            "<strong>Fazal Framework</strong>",
            "<span>tiny frontend framework</span>",
            "</div>",
            "</div>",
            '<nav class="nav-list">',
            navHtml,
            "</nav>",
            "</aside>"
        ].join("");
    }

    function setActiveNav() {
        const currentFile = window.location.pathname.split("/").pop() || "index.html";

        $(".nav-link").each(function () {
            const linkFile = ($(this).attr("href") || "").split("/").pop();
            $(this).toggleClass("active", linkFile === currentFile);
        });
    }

    function showStatus(message, type) {
        const statusType = type || "info";
        const statusEl = $('<div class="status-message" role="status"></div>');

        statusEl.text(message);
        statusEl.attr("data-type", statusType);
        $("body").append(statusEl);

        window.setTimeout(function () {
            statusEl.fadeOut(180, function () {
                statusEl.remove();
            });
        }, 2600);
    }

    function escapeHtml(str) {
        return String(str || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function downloadJson(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = filename;
        anchor.click();

        URL.revokeObjectURL(url);
    }

    function copyText(text, message) {
        if (!navigator.clipboard) {
            showStatus("Clipboard API is not available in this browser.", "warning");
            return;
        }

        navigator.clipboard.writeText(text).then(function () {
            showStatus(message || "Copied to clipboard.", "success");
        });
    }

    function getTransitionSettings() {
        const workspace = loadWorkspace();

        return {
            transitionSpeedMs: Number(workspace.settings.transitionSpeedMs) || 320,
            loaderDelayMs: Number(workspace.settings.loaderDelayMs) || 180
        };
    }

    function buildOverlay() {
        if (document.querySelector(".transition-overlay")) {
            return;
        }

        const theme = window.FazalFramework && window.FazalFramework.Theme
            ? window.FazalFramework.Theme.getTheme()
            : {};

        const overlay = document.createElement("div");
        overlay.className = "transition-overlay";
        overlay.innerHTML = [
            '<div class="loader-box" hidden>',
            '<div class="loader-ring"></div>',
            '<div class="loader-text">' + escapeHtml(theme.loaderText || "Loading Fazal Framework...") + "</div>",
            "</div>"
        ].join("");

        document.body.appendChild(overlay);
    }

    function showTransitionOverlay(withLoader) {
        buildOverlay();

        const overlay = document.querySelector(".transition-overlay");
        const loaderBox = overlay.querySelector(".loader-box");
        const settings = getTransitionSettings();

        window.clearTimeout(overlayTimer);
        overlay.classList.remove("is-hidden");

        if (withLoader) {
            overlayTimer = window.setTimeout(function () {
                loaderBox.hidden = false;
            }, settings.loaderDelayMs);
        } else {
            loaderBox.hidden = true;
        }
    }

    function hideTransitionOverlay() {
        buildOverlay();

        const overlay = document.querySelector(".transition-overlay");
        const loaderBox = overlay.querySelector(".loader-box");

        window.clearTimeout(overlayTimer);
        loaderBox.hidden = true;
        overlay.classList.add("is-hidden");
    }

    function navigateWithTransition(url) {
        const settings = getTransitionSettings();

        showTransitionOverlay(true);

        window.setTimeout(function () {
            window.location.href = url;
        }, settings.transitionSpeedMs);
    }

    function initPageTransitions() {
        buildOverlay();

        $(document).on("click", "a[href]", function (event) {
            const href = $(this).attr("href");

            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                $(this).attr("target") === "_blank"
            ) {
                return;
            }

            event.preventDefault();
            navigateWithTransition(href);
        });

        window.setTimeout(function () {
            hideTransitionOverlay();
        }, 80);
    }

    function initThemeRuntime() {
        if (!window.FazalFramework || !window.FazalFramework.Theme) {
            return;
        }

        const theme = window.FazalFramework.Theme.getTheme();

        window.FazalFramework.Theme.applyTheme(theme);
    }

    function initSharedPage(activePage) {
        initThemeRuntime();

        const shell = document.querySelector("[data-shell]");

        if (shell) {
            shell.insertAdjacentHTML("afterbegin", renderSidebar(activePage));
        }

        setActiveNav();
        initPageTransitions();

        if (window.FazalFramework && window.FazalFramework.EventBus) {
            window.FazalFramework.EventBus.emit("pageinit", {
                page: activePage,
                createdAt: new Date().toISOString()
            });
        }
    }

    window.FazalShared = {
        workspaceKey: workspaceKey,
        siteConfig: siteConfig,
        generateId: generateId,
        formatTimestamp: formatTimestamp,
        loadWorkspace: loadWorkspace,
        saveWorkspace: saveWorkspace,
        resetWorkspace: resetWorkspace,
        addActivityLog: addActivityLog,
        renderSidebar: renderSidebar,
        setActiveNav: setActiveNav,
        showStatus: showStatus,
        escapeHtml: escapeHtml,
        downloadJson: downloadJson,
        copyText: copyText,
        initPageTransitions: initPageTransitions,
        showTransitionOverlay: showTransitionOverlay,
        hideTransitionOverlay: hideTransitionOverlay,
        navigateWithTransition: navigateWithTransition,
        initSharedPage: initSharedPage
    };
})(window, document, jQuery);