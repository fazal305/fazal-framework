(function (window) {
    "use strict";

    function shallowClone(value) {
        return Object.assign({}, value || {});
    }

    function hasChanged(currentState, partialState) {
        return Object.keys(partialState).some(function (key) {
            return currentState[key] !== partialState[key];
        });
    }

    function createStore(initialState) {
        let state = shallowClone(initialState);
        const subscribers = new Set();

        function getState() {
            return shallowClone(state);
        }

        function setState(partialState) {
            const nextPartial = shallowClone(partialState);

            if (!hasChanged(state, nextPartial)) {
                return false;
            }

            const previousState = getState();
            state = Object.assign({}, state, nextPartial);
            const nextState = getState();

            subscribers.forEach(function (listener) {
                listener(nextState, previousState);
            });

            if (window.FazalEventBus) {
                window.FazalEventBus.emit("statechange", {
                    nextState: nextState,
                    previousState: previousState
                });
            }

            return true;
        }

        function subscribe(listener) {
            if (typeof listener !== "function") {
                throw new Error("Store.subscribe(listener) requires a function.");
            }

            subscribers.add(listener);

            return function unsubscribe() {
                subscribers.delete(listener);
            };
        }

        return {
            getState: getState,
            setState: setState,
            subscribe: subscribe
        };
    }

    window.FazalState = {
        createStore: createStore
    };
})(window);