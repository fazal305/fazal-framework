(function (window) {
    "use strict";

    function createBus(namespace) {
        const events = {};

        function on(eventName, handler) {
            if (typeof eventName !== "string" || typeof handler !== "function") {
                throw new Error("EventBus.on(eventName, handler) requires a string and a function.");
            }

            if (!events[eventName]) {
                events[eventName] = new Set();
            }

            events[eventName].add(handler);

            return function unsubscribe() {
                off(eventName, handler);
            };
        }

        function off(eventName, handler) {
            if (!events[eventName]) {
                return;
            }

            events[eventName].delete(handler);

            if (events[eventName].size === 0) {
                delete events[eventName];
            }
        }

        function once(eventName, handler) {
            if (typeof handler !== "function") {
                throw new Error("EventBus.once(eventName, handler) requires a function handler.");
            }

            function onceHandler(payload) {
                off(eventName, onceHandler);
                handler(payload);
            }

            return on(eventName, onceHandler);
        }

        function emit(eventName, payload) {
            if (!events[eventName]) {
                return false;
            }

            events[eventName].forEach(function (handler) {
                handler({
                    eventName: eventName,
                    payload: payload,
                    namespace: namespace,
                    createdAt: new Date().toISOString()
                });
            });

            return true;
        }

        function listEvents() {
            return Object.keys(events);
        }

        return {
            namespace: namespace,
            on: on,
            off: off,
            once: once,
            emit: emit,
            listEvents: listEvents
        };
    }

    const defaultBus = createBus("default");

    window.FazalEventBus = {
        create: createBus,
        on: defaultBus.on,
        off: defaultBus.off,
        once: defaultBus.once,
        emit: defaultBus.emit,
        listEvents: defaultBus.listEvents
    };
})(window);