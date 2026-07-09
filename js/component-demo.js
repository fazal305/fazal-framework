(function (window, document, $) {
    "use strict";

    const Component = window.FazalFramework.Component;
    const Shared = window.FazalShared;

    const instances = {
        counters: [],
        todo: null
    };

    function addLog(action, detail) {
        const log = document.getElementById("componentLog");

        log.insertAdjacentHTML(
            "afterbegin",
            [
                '<div class="event-entry">',
                '<strong class="event-name">' + Shared.escapeHtml(action) + "</strong>",
                '<div class="muted">' + Shared.formatTimestamp(new Date().toISOString()) + "</div>",
                "<p class='mb-0'>" + Shared.escapeHtml(detail) + "</p>",
                "</div>"
            ].join("")
        );
    }

    function defineComponents() {
        Component.define("CounterCard", {
            initialState: {
                count: 0
            },
            render: function (props, state) {
                return [
                    '<article class="component-instance">',
                    "<div>",
                    "<h3>" + Shared.escapeHtml(props.title) + "</h3>",
                    '<p class="muted mb-0">' + Shared.escapeHtml(props.description) + "</p>",
                    "</div>",
                    '<div class="counter-value">' + state.count + "</div>",
                    '<div class="d-flex flex-wrap gap-2">',
                    '<button class="btn-theme" data-action="increment">Increment</button>',
                    '<button class="btn-ghost" data-action="decrement">Decrement</button>',
                    '<button class="btn-ghost" data-action="reset">Reset</button>',
                    '<button class="btn-ghost" data-action="destroy">Destroy Instance</button>',
                    "</div>",
                    "</article>"
                ].join("");
            },
            onMount: function (el, api) {
                addLog("Mounted", api.props.title + " mounted.");

                $(el).on("click", "[data-action]", function () {
                    const action = $(this).attr("data-action");
                    const state = api.getState();

                    if (action === "increment") {
                        api.setState({ count: state.count + 1 });
                    }

                    if (action === "decrement") {
                        api.setState({ count: state.count - 1 });
                    }

                    if (action === "reset") {
                        api.setState({ count: 0 });
                    }

                    if (action === "destroy") {
                        api.destroy();
                    }
                });
            },
            onUpdate: function (el, api) {
                addLog("Updated", api.props.title + " changed to " + api.getState().count + ".");
            },
            onDestroy: function (el, api) {
                addLog("Destroyed", api.props.title + " was removed from the DOM.");
                Shared.addActivityLog(
                    "Component Demo",
                    "Destroyed component",
                    api.props.title + " proved the destroy lifecycle hook works."
                );
            }
        });

        Component.define("TodoCard", {
            initialState: {
                input: "",
                todos: ["Define components", "Mount instances", "Trigger re-render"]
            },
            render: function (props, state) {
                const todoHtml = state.todos
                    .map(function (todo, index) {
                        return [
                            '<li class="todo-item">',
                            "<span>" + Shared.escapeHtml(todo) + "</span>",
                            '<button class="btn-ghost btn-sm" data-remove-index="' + index + '">Remove</button>',
                            "</li>"
                        ].join("");
                    })
                    .join("");

                return [
                    '<article class="component-instance">',
                    "<h3>" + Shared.escapeHtml(props.title) + "</h3>",
                    '<p class="muted">' + Shared.escapeHtml(props.description) + "</p>",
                    '<div class="d-flex gap-2 flex-wrap">',
                    '<input class="form-control" data-todo-input value="' + Shared.escapeHtml(state.input) + '" placeholder="Add a task">',
                    '<button class="btn-theme" data-action="add">Add</button>',
                    "</div>",
                    '<ul class="todo-list mt-3">' + todoHtml + "</ul>",
                    "</article>"
                ].join("");
            },
            onMount: function (el, api) {
                addLog("Mounted", "TodoCard mounted.");

                $(el).on("input", "[data-todo-input]", function () {
                    api.setState({ input: $(this).val() });
                });

                $(el).on("click", "[data-action='add']", function () {
                    const state = api.getState();
                    const value = state.input.trim();

                    if (!value) {
                        return;
                    }

                    api.setState({
                        input: "",
                        todos: state.todos.concat(value)
                    });
                });

                $(el).on("click", "[data-remove-index]", function () {
                    const index = Number($(this).attr("data-remove-index"));
                    const state = api.getState();

                    api.setState({
                        todos: state.todos.filter(function (todo, todoIndex) {
                            return todoIndex !== index;
                        })
                    });
                });
            },
            onUpdate: function (el, api) {
                addLog("Updated", "TodoCard now has " + api.getState().todos.length + " item(s).");
            }
        });
    }

    function mountCounter(title, description) {
        const mountArea = document.getElementById("counterMountArea");

        const counter = Component.mount("CounterCard", mountArea, {
            title: title,
            description: description
        });

        instances.counters.push(counter);

        Shared.addActivityLog(
            "Component Demo",
            "Mounted component",
            title + " mounted as an independent Counter instance."
        );
    }

    function initComponentDemo() {
        Shared.initSharedPage("component");

        defineComponents();

        mountCounter("Counter Instance A", "This counter has its own private state.");
        mountCounter("Counter Instance B", "This one uses the same definition but does not share state.");

        instances.todo = Component.mount("TodoCard", document.getElementById("todoMountArea"), {
            title: "TodoList Component",
            description: "A tiny stateful list component rendered by FazalFramework.Component."
        });

        $("#mountCounterBtn").on("click", function () {
            mountCounter(
                "Counter Instance " + String.fromCharCode(65 + instances.counters.length),
                "Dynamically mounted after page load using the same component definition."
            );
        });
    }

    document.addEventListener("DOMContentLoaded", initComponentDemo);
})(window, document, jQuery);