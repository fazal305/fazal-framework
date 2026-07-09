(function (window, document, $) {
    "use strict";

    const Router = window.FazalFramework.Router;
    const Shared = window.FazalShared;

    const routeViews = {
        home: {
            title: "Router Home",
            description: "This content was rendered by the registered / route handler.",
            items: ["Hash navigation", "No full page reload", "file:// compatible"]
        },
        products: {
            title: "Products Route",
            description: "This route shows a simple product list generated from config.",
            items: ["Framework Starter Kit", "Theme Token Pack", "Plugin Sandbox"]
        }
    };

    function renderList(items) {
        return items
            .map(function (item) {
                return "<li>" + Shared.escapeHtml(item) + "</li>";
            })
            .join("");
    }

    function renderView(title, description, items) {
        document.getElementById("routerView").innerHTML = [
            "<h3>" + Shared.escapeHtml(title) + "</h3>",
            '<p class="muted">' + Shared.escapeHtml(description) + "</p>",
            "<ul>",
            renderList(items),
            "</ul>"
        ].join("");
    }

    function registerRoutes() {
        Router.register("/", function () {
            renderView(routeViews.home.title, routeViews.home.description, routeViews.home.items);
        });

        Router.register("/products", function () {
            renderView(routeViews.products.title, routeViews.products.description, routeViews.products.items);
        });

        Router.register("/product/:id", function (params) {
            renderView(
                "Product Detail",
                "This route proves named params work. Product ID: " + params.id,
                ["Param parsed as id", "Handler received params", "Readout updated live"]
            );
        });

        Router.register("/profile/:username", function (params) {
            renderView(
                "Profile Route",
                "This route parsed a username param from the URL hash.",
                ["Username: " + params.username, "Independent route handler", "Successful route hook"]
            );
        });
    }

    function updateReadout(route) {
        document.getElementById("currentPath").textContent = route.path || "/";
        document.getElementById("currentParams").textContent = JSON.stringify(route.params || {}, null, 2);
    }

    function initRouterDemo() {
        Shared.initSharedPage("router");

        registerRoutes();

        Router.onRouteChange(function (route) {
            updateReadout(route);

            Shared.addActivityLog(
                "Router Demo",
                "Route changed",
                "Navigated to " + route.path + " with params " + JSON.stringify(route.params)
            );
        });

        $("#routerMiniNav").on("click", "[data-route]", function () {
            const targetRoute = $(this).attr("data-route");

            Router.navigate(targetRoute);
        });

        Router.start();

        if (!window.location.hash) {
            Router.navigate("/");
        }
    }

    document.addEventListener("DOMContentLoaded", initRouterDemo);
})(window, document, jQuery);