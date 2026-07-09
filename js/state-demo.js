(function (window, document, $) {
    "use strict";

    const State = window.FazalFramework.State;
    const Shared = window.FazalShared;

    const store = State.createStore({
        stockCount: 42,
        salesToday: 8,
        status: "Ready",
        lastUpdated: new Date().toISOString()
    });

    function addLog(detail) {
        document.getElementById("stateLog").insertAdjacentHTML(
            "afterbegin",
            [
                '<div class="event-entry">',
                '<strong class="event-name">Store updated</strong>',
                '<div class="muted">' + Shared.formatTimestamp(new Date().toISOString()) + "</div>",
                "<p class='mb-0'>" + Shared.escapeHtml(detail) + "</p>",
                "</div>"
            ].join("")
        );
    }

    function updateStore(partialState, detail) {
        const changed = store.setState(
            Object.assign({}, partialState, {
                lastUpdated: new Date().toISOString()
            })
        );

        if (changed) {
            Shared.addActivityLog("State Demo", "Store update", detail);
        }
    }

    function renderInventoryPanel(state) {
        document.getElementById("inventoryPanel").innerHTML = [
            "<h2>Inventory Panel</h2>",
            '<p class="muted">Subscribed panel A</p>',
            '<div class="state-value">' + state.stockCount + "</div>",
            '<p class="mb-0">Products in stock</p>',
            '<div class="state-actions mt-3">',
            '<button class="btn-theme" data-state-action="addStock">Add Stock</button>',
            '<button class="btn-ghost" data-state-action="removeStock">Remove Stock</button>',
            "</div>"
        ].join("");
    }

    function renderSalesPanel(state) {
        document.getElementById("salesPanel").innerHTML = [
            "<h2>Sales Panel</h2>",
            '<p class="muted">Subscribed panel B</p>',
            '<div class="state-value">' + state.salesToday + "</div>",
            '<p class="mb-0">Sales recorded today</p>',
            '<div class="state-actions mt-3">',
            '<button class="btn-theme" data-state-action="addSale">Record Sale</button>',
            '<button class="btn-ghost" data-state-action="resetSales">Reset Sales</button>',
            "</div>"
        ].join("");
    }

    function renderJson(state) {
        document.getElementById("stateJson").textContent = JSON.stringify(state, null, 2);
    }

    function renderAll(state) {
        renderInventoryPanel(state);
        renderSalesPanel(state);
        renderJson(state);
    }

    function bindActions() {
        $(document).on("click", "[data-state-action]", function () {
            const action = $(this).attr("data-state-action");
            const state = store.getState();

            if (action === "addStock") {
                updateStore({ stockCount: state.stockCount + 1, status: "Stock added" }, "Added one stock unit.");
            }

            if (action === "removeStock") {
                updateStore({ stockCount: Math.max(0, state.stockCount - 1), status: "Stock removed" }, "Removed one stock unit.");
            }

            if (action === "addSale") {
                updateStore({ salesToday: state.salesToday + 1, status: "Sale recorded" }, "Recorded one sale.");
            }

            if (action === "resetSales") {
                updateStore({ salesToday: 0, status: "Sales reset" }, "Reset today's sales.");
            }
        });
    }

    function initStateDemo() {
        Shared.initSharedPage("state");

        store.subscribe(function (nextState, previousState) {
            renderAll(nextState);

            addLog(
                "Changed from " +
                JSON.stringify(previousState) +
                " to " +
                JSON.stringify(nextState)
            );

            if (window.FazalFramework.Plugins && window.FazalFramework.Plugins.runHook) {
                window.FazalFramework.Plugins.runHook("onStateChange", {
                    storeName: "state-demo-store",
                    nextState: nextState,
                    previousState: previousState
                });
            }
        });

        renderAll(store.getState());
        bindActions();

        window.StateDemoStore = store;

        Shared.addActivityLog(
            "State Demo",
            "Store initialized",
            "Created one shared store and subscribed two independent UI panels."
        );
    }

    document.addEventListener("DOMContentLoaded", initStateDemo);
})(window, document, jQuery);