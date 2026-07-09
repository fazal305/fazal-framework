(function (window, document, $) {
    "use strict";

    const Theme = window.FazalFramework.Theme;
    const Shared = window.FazalShared;

    const editableTokens = [
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

    function addThemeLog(theme) {
        document.getElementById("themeLog").insertAdjacentHTML(
            "afterbegin",
            [
                '<div class="event-entry">',
                '<strong class="event-name">themechange fired</strong>',
                '<div class="muted">' + Shared.formatTimestamp(new Date().toISOString()) + "</div>",
                "<p class='mb-0'>Primary: " + Shared.escapeHtml(theme.primary) + " • Font: " + Shared.escapeHtml(theme["font-family"]) + "</p>",
                "</div>"
            ].join("")
        );
    }

    function renderControl(token, theme) {
        if (token.type === "select") {
            const options = token.options
                .map(function (option) {
                    return '<option value="' + Shared.escapeHtml(option) + '"' + (theme[token.name] === option ? " selected" : "") + ">" + Shared.escapeHtml(option) + "</option>";
                })
                .join("");

            return [
                '<label class="token-row">',
                "<strong>" + token.label + "</strong>",
                '<select class="form-select" data-theme-token="' + token.name + '">' + options + "</select>",
                "</label>"
            ].join("");
        }

        return [
            '<label class="token-row">',
            "<strong>" + token.label + "</strong>",
            '<input class="form-control form-control-color" type="color" value="' + theme[token.name] + '" data-theme-token="' + token.name + '">',
            "</label>"
        ].join("");
    }

    function renderControls() {
        const theme = Theme.getTheme();

        document.getElementById("themeControls").innerHTML = editableTokens
            .map(function (token) {
                return renderControl(token, theme);
            })
            .join("");
    }

    function updateThemeToken(token, value) {
        const theme = Theme.getTheme();

        theme[token] = value;
        Theme.applyTheme(theme);

        Shared.addActivityLog(
            "Theme Engine Demo",
            "Theme updated",
            token + " changed through FazalFramework.Theme.applyTheme()."
        );
    }

    function initThemeDemo() {
        Shared.initSharedPage("theme");

        renderControls();

        Theme.onThemeChange(function (theme) {
            addThemeLog(theme);
        });

        $("#themeControls").on("input change", "[data-theme-token]", function () {
            updateThemeToken($(this).attr("data-theme-token"), $(this).val());
        });

        addThemeLog(Theme.getTheme());
    }

    document.addEventListener("DOMContentLoaded", initThemeDemo);
})(window, document, jQuery);