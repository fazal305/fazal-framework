(function (window, document, $) {
    "use strict";

    const Theme = window.FazalFramework.Theme;
    const Shared = window.FazalShared;

    const themeTokens = [
        { name: "bg", label: "Background", type: "color" },
        { name: "bg-soft", label: "Soft Background", type: "color" },
        { name: "card", label: "Card", type: "color" },
        { name: "text", label: "Text", type: "color" },
        { name: "muted", label: "Muted Text", type: "color" },
        { name: "primary", label: "Primary", type: "color" },
        { name: "secondary", label: "Secondary", type: "color" },
        { name: "success", label: "Success", type: "color" },
        { name: "warning", label: "Warning", type: "color" },
        { name: "danger", label: "Danger", type: "color" },
        {
            name: "font-family",
            label: "Font Family",
            type: "select",
            options: [
                "Inter, system-ui, sans-serif",
                "Arial, system-ui, sans-serif",
                "Georgia, serif",
                "Courier New, monospace",
                "Verdana, system-ui, sans-serif"
            ]
        }
    ];

    function renderThemeControl(token, theme) {
        if (token.type === "select") {
            const options = token.options
                .map(function (option) {
                    return '<option value="' + Shared.escapeHtml(option) + '"' + (theme[token.name] === option ? " selected" : "") + ">" + Shared.escapeHtml(option) + "</option>";
                })
                .join("");

            return [
                '<label class="setting-row">',
                "<strong>" + Shared.escapeHtml(token.label) + "</strong>",
                '<select class="form-select" data-theme-token="' + Shared.escapeHtml(token.name) + '">' + options + "</select>",
                "</label>"
            ].join("");
        }

        return [
            '<label class="setting-row">',
            "<strong>" + Shared.escapeHtml(token.label) + "</strong>",
            '<input class="form-control form-control-color" type="color" value="' + Shared.escapeHtml(theme[token.name]) + '" data-theme-token="' + Shared.escapeHtml(token.name) + '">',
            "</label>"
        ].join("");
    }

    function renderThemeControls() {
        const theme = Theme.getTheme();

        document.getElementById("settingsThemeControls").innerHTML = themeTokens
            .map(function (token) {
                return renderThemeControl(token, theme);
            })
            .join("");
    }

    function loadSettingsIntoForm() {
        const workspace = Shared.loadWorkspace();

        $("#compactSidebarInput").prop("checked", Boolean(workspace.settings.compactSidebar));
        $("#transitionSpeedInput").val(workspace.settings.transitionSpeedMs);
        $("#loaderDelayInput").val(workspace.settings.loaderDelayMs);
    }

    function saveSettings() {
        const workspace = Shared.loadWorkspace();

        workspace.settings.compactSidebar = $("#compactSidebarInput").is(":checked");
        workspace.settings.transitionSpeedMs = Number($("#transitionSpeedInput").val()) || workspace.settings.transitionSpeedMs;
        workspace.settings.loaderDelayMs = Number($("#loaderDelayInput").val()) || workspace.settings.loaderDelayMs;

        Shared.saveWorkspace(workspace);
        Shared.addActivityLog("Settings", "Settings saved", "Updated sidebar and transition settings.");
        Shared.showStatus("Settings saved. Refresh or navigate to see sidebar changes.", "success");
    }

    function updateTheme(token, value) {
        const theme = Theme.getTheme();

        theme[token] = value;
        Theme.applyTheme(theme);

        Shared.addActivityLog("Settings", "Theme token updated", token + " changed from Settings.");
    }

    function exportWorkspace() {
        const exportData = {
            workspace: Shared.loadWorkspace(),
            themeSnapshot: Theme.getTheme(),
            exportedAt: new Date().toISOString()
        };

        Shared.downloadJson("fazal-framework-workspace.json", exportData);
        Shared.showStatus("Workspace JSON exported.", "success");
    }

    function importWorkspace() {
        const rawJson = $("#importWorkspaceInput").val().trim();

        if (!rawJson) {
            Shared.showStatus("Paste workspace JSON first.", "warning");
            return;
        }

        try {
            const parsed = JSON.parse(rawJson);

            if (parsed.workspace) {
                Shared.saveWorkspace(parsed.workspace);
            }

            if (parsed.themeSnapshot) {
                Theme.applyTheme(parsed.themeSnapshot);
            }

            Shared.addActivityLog("Settings", "Workspace imported", "Imported workspace JSON and theme snapshot.");
            Shared.showStatus("Workspace imported. Refreshing page.", "success");

            window.setTimeout(function () {
                window.location.reload();
            }, 600);
        } catch (error) {
            Shared.showStatus("Invalid JSON. Import failed.", "danger");
        }
    }

    function resetWorkspace() {
        Shared.resetWorkspace();
        Shared.showStatus("Workspace reset. Refreshing page.", "success");

        window.setTimeout(function () {
            window.location.reload();
        }, 600);
    }

    function clearStorage() {
        localStorage.removeItem(Shared.workspaceKey);
        localStorage.removeItem(Theme.storageKey);

        Shared.showStatus("LocalStorage cleared. Refreshing page.", "success");

        window.setTimeout(function () {
            window.location.reload();
        }, 600);
    }

    function bindEvents() {
        $("#settingsThemeControls").on("input change", "[data-theme-token]", function () {
            updateTheme($(this).attr("data-theme-token"), $(this).val());
        });

        $("#saveSettingsBtn").on("click", saveSettings);
        $("#exportWorkspaceBtn").on("click", exportWorkspace);
        $("#importWorkspaceBtn").on("click", importWorkspace);
        $("#resetWorkspaceBtn").on("click", resetWorkspace);
        $("#clearStorageBtn").on("click", clearStorage);
    }

    function initSettings() {
        Shared.initSharedPage("settings");

        renderThemeControls();
        loadSettingsIntoForm();
        bindEvents();

        Shared.addActivityLog(
            "Settings",
            "Settings opened",
            "Settings page loaded using FazalFramework.Theme as the real theme source."
        );
    }

    document.addEventListener("DOMContentLoaded", initSettings);
})(window, document, jQuery);