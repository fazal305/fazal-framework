(function (window, document) {
    "use strict";

    const definitions = {};

    function cloneState(value) {
        return Object.assign({}, value || {});
    }

    function define(name, config) {
        if (!name || typeof name !== "string") {
            throw new Error("FazalComponent.define(name, config) requires a component name.");
        }

        if (!config || typeof config.render !== "function") {
            throw new Error("Component config requires a render(props, state) function.");
        }

        definitions[name] = {
            name: name,
            initialState: config.initialState || {},
            render: config.render,
            onMount: config.onMount,
            onUpdate: config.onUpdate,
            onDestroy: config.onDestroy
        };

        return definitions[name];
    }

    function mount(name, targetEl, props) {
        const definition = definitions[name];

        if (!definition) {
            throw new Error("Component not defined: " + name);
        }

        if (!targetEl) {
            throw new Error("FazalComponent.mount(name, targetEl, props) requires a target element.");
        }

        const instanceEl = document.createElement("div");
        instanceEl.setAttribute("data-fazal-component", name);

        let state = cloneState(definition.initialState);
        const componentProps = Object.assign({}, props || {});
        let isDestroyed = false;

        const api = {
            name: name,
            props: componentProps,
            getState: function () {
                return cloneState(state);
            },
            setState: function (partialState) {
                if (isDestroyed) {
                    return false;
                }

                const nextState = Object.assign({}, state, partialState || {});
                const changed = Object.keys(nextState).some(function (key) {
                    return nextState[key] !== state[key];
                });

                if (!changed) {
                    return false;
                }

                state = nextState;
                renderInstance();

                if (typeof definition.onUpdate === "function") {
                    definition.onUpdate(instanceEl, api);
                }

                return true;
            },
            destroy: function () {
                if (isDestroyed) {
                    return;
                }

                isDestroyed = true;

                if (typeof definition.onDestroy === "function") {
                    definition.onDestroy(instanceEl, api);
                }

                instanceEl.remove();
            }
        };

        function renderInstance() {
            instanceEl.innerHTML = definition.render(componentProps, state, api);
        }

        renderInstance();
        targetEl.appendChild(instanceEl);

        if (typeof definition.onMount === "function") {
            definition.onMount(instanceEl, api);
        }

        if (window.FazalPlugins && window.FazalPlugins.runHook) {
            window.FazalPlugins.runHook("onComponentMount", {
                name: name,
                element: instanceEl,
                props: componentProps,
                state: cloneState(state)
            });
        }

        if (window.FazalEventBus) {
            window.FazalEventBus.emit("componentmount", {
                name: name,
                props: componentProps,
                state: cloneState(state)
            });
        }

        return api;
    }

    function listDefinitions() {
        return Object.keys(definitions);
    }

    window.FazalComponent = {
        define: define,
        mount: mount,
        listDefinitions: listDefinitions
    };
})(window, document);