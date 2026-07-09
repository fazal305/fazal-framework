(function (window, document) {
    "use strict";

    const Shared = window.FazalShared;

    const caseStudies = [
        {
            project: "NIGHTCITY OS",
            biggestWin: "Component + EventBus",
            explanation:
                "Window cards, widgets, dock actions, and app panels could become reusable components. EventBus would let independent windows communicate without direct DOM references.",
            before:
                `function renderWindow(app) {
  desktop.innerHTML += '<div class="window">' + app.title + '</div>';
}

button.addEventListener('click', function () {
  renderWindow(app);
});`,
            after:
                `FazalFramework.Component.define('OsWindow', {
  initialState: { minimized: false },
  render: function (props, state) {
    return '<article class="window">' + props.title + '</article>';
  }
});

FazalFramework.EventBus.emit('window:opened', { id: app.id });`
        },
        {
            project: "DevKit Studio",
            biggestWin: "Theme + Plugins",
            explanation:
                "Theme settings, tool registration, and optional panels could be centralized. New tools could register as plugins instead of being hardcoded in multiple files.",
            before:
                `function applyThemeSettings(settings) {
  root.style.setProperty('--primary', settings.primary);
  root.style.setProperty('--bg', settings.bg);
}

const tools = ['JSON Explorer', 'API Client'];`,
            after:
                `FazalFramework.Theme.applyTheme({
  primary: workspace.theme.primary,
  bg: workspace.theme.bg
});

FazalFramework.Plugins.register({
  name: 'ApiClientTool',
  install: function (framework) {}
});`
        },
        {
            project: "Database Engineering Studio",
            biggestWin: "State + Router",
            explanation:
                "Schema panels, query history, selected table, and SQL playground state could be stored in one observable store. Router params could drive focused table/query views.",
            before:
                `let selectedTable = null;

function loadWorkspace() {
  return JSON.parse(localStorage.getItem('db-workspace'));
}

function renderSidebar() {
  sidebar.innerHTML = tables.map(renderTable).join('');
}`,
            after:
                `const dbStore = FazalFramework.State.createStore({
  selectedTable: null,
  queryHistory: []
});

FazalFramework.Router.register('/table/:name', function (params) {
  dbStore.setState({ selectedTable: params.name });
});`
        }
    ];

    function renderCaseStudy(study) {
        return [
            '<article class="card-panel case-card">',
            "<div>",
            "<h2>" + Shared.escapeHtml(study.project) + "</h2>",
            '<span class="badge-soft">Biggest win: ' + Shared.escapeHtml(study.biggestWin) + "</span>",
            '<p class="muted mt-3 mb-0">' + Shared.escapeHtml(study.explanation) + "</p>",
            "</div>",
            '<div class="before-after">',
            "<div>",
            '<div class="code-label">Before</div>',
            "<pre><code>" + Shared.escapeHtml(study.before) + "</code></pre>",
            "</div>",
            "<div>",
            '<div class="code-label">After with Fazal Framework</div>',
            "<pre><code>" + Shared.escapeHtml(study.after) + "</code></pre>",
            "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function initCaseStudies() {
        Shared.initSharedPage("caseStudies");

        document.getElementById("caseStudyList").innerHTML = caseStudies
            .map(renderCaseStudy)
            .join("");

        Shared.addActivityLog(
            "Case Studies",
            "Migration plan opened",
            "Viewed illustrative before/after examples for future Fazal Framework migration."
        );
    }

    document.addEventListener("DOMContentLoaded", initCaseStudies);
})(window, document);