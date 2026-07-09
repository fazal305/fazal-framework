(function (window, document, $) {
    "use strict";

    const EventBus = window.FazalFramework.EventBus;
    const Shared = window.FazalShared;

    let unsubscribeMain = null;

    function addLog(title, detail) {
        document.getElementById("eventLog").insertAdjacentHTML(
            "afterbegin",
            [
                '<div class="event-entry">',
                '<strong class="event-name">' + Shared.escapeHtml(title) + "</strong>",
                '<div class="muted">' + Shared.formatTimestamp(new Date().toISOString()) + "</div>",
                "<p class='mb-0'>" + Shared.escapeHtml(detail) + "</p>",
                "</div>"
            ].join("")
        );
    }

    function setStatus(message) {
        document.getElementById("subscriberStatus").textContent = message;
    }

    function eventHandler(event) {
        addLog(
            event.eventName,
            "Received payload: " + JSON.stringify(event.payload)
        );
    }

    function subscribe() {
        if (unsubscribeMain) {
            setStatus("Already subscribed");
            return;
        }

        unsubscribeMain = EventBus.on("framework:activity", eventHandler);
        setStatus("Subscribed with on()");
        addLog("Subscriber", "Subscriber is now listening to framework:activity.");

        Shared.addActivityLog(
            "Event Bus Demo",
            "Subscriber enabled",
            "Subscribed to framework:activity using EventBus.on()."
        );
    }

    function unsubscribe() {
        if (!unsubscribeMain) {
            setStatus("No active subscription");
            return;
        }

        unsubscribeMain();
        unsubscribeMain = null;
        setStatus("Unsubscribed with off()");
        addLog("Subscriber", "Subscriber stopped listening. New events will not appear.");
    }

    function listenOnce() {
        EventBus.once("framework:activity", function (event) {
            addLog(
                "Once listener",
                "Received once and auto-unsubscribed: " + JSON.stringify(event.payload)
            );
        });

        setStatus("One-time listener armed");
    }

    function publish(eventName) {
        const payload = {
            source: "Publisher Panel",
            action: eventName,
            id: Shared.generateId("event")
        };

        EventBus.emit("framework:activity", payload);

        Shared.addActivityLog(
            "Event Bus Demo",
            "Published event",
            eventName + " was emitted through the shared Event Bus."
        );
    }

    function initEventBusDemo() {
        Shared.initSharedPage("eventBus");

        $("#subscribeBtn").on("click", subscribe);
        $("#unsubscribeBtn").on("click", unsubscribe);
        $("#onceBtn").on("click", listenOnce);

        $("[data-publish-event]").on("click", function () {
            publish($(this).attr("data-publish-event"));
        });

        subscribe();
    }

    document.addEventListener("DOMContentLoaded", initEventBusDemo);
})(window, document, jQuery);