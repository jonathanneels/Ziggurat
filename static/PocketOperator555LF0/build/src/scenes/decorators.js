"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sets the decorated member visible in the inspector.
 * @param type the property type.
 * @param name optional name to be shown in the editor's inspector.
 * @param defaultValue optional default value set in the TS code.
 */
function visibleInInspector(type, name, defaultValue) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._InspectorValues = (_a = ctor._InspectorValues) !== null && _a !== void 0 ? _a : [];
        ctor._InspectorValues.push({
            type: type,
            name: name !== null && name !== void 0 ? name : propertyKey.toString(),
            propertyKey: propertyKey.toString(),
            defaultValue: defaultValue,
        });
    };
}
exports.visibleInInspector = visibleInInspector;
/**
 * Sets the decorated member linked to a child node.
 * @param nodeName defines the name of the node in children to retrieve.
 */
function fromChildren(nodeName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._ChildrenValues = (_a = ctor._ChildrenValues) !== null && _a !== void 0 ? _a : [];
        ctor._ChildrenValues.push({
            nodeName: nodeName !== null && nodeName !== void 0 ? nodeName : propertyKey.toString(),
            propertyKey: propertyKey.toString(),
        });
    };
}
exports.fromChildren = fromChildren;
/**
 * Sets the decorated member linked to a node in the scene.
 * @param nodeName defines the name of the node in the scene to retrieve.
 */
function fromScene(nodeName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._SceneValues = (_a = ctor._SceneValues) !== null && _a !== void 0 ? _a : [];
        ctor._SceneValues.push({
            nodeName: nodeName !== null && nodeName !== void 0 ? nodeName : propertyKey.toString(),
            propertyKey: propertyKey.toString(),
        });
    };
}
exports.fromScene = fromScene;
/**
 * Sets the decorated member linked to a particle system which has the current Mesh attached.
 * @param particleSystemname the name of the attached particle system to retrieve.
 */
function fromParticleSystems(particleSystemname) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._ParticleSystemValues = (_a = ctor._ParticleSystemValues) !== null && _a !== void 0 ? _a : [];
        ctor._ParticleSystemValues.push({
            particleSystemName: particleSystemname !== null && particleSystemname !== void 0 ? particleSystemname : propertyKey.toString(),
            propertyKey: propertyKey.toString(),
        });
    };
}
exports.fromParticleSystems = fromParticleSystems;
/**
 * Sets the decorated member function to be called on the given pointer event is fired.
 * @param type the event type to listen to execute the decorated function.
 * @param onlyWhenMeshPicked defines wether or not the decorated function should be called only when the mesh is picked. default true.
 */
function onPointerEvent(type, onlyWhenMeshPicked) {
    if (onlyWhenMeshPicked === void 0) { onlyWhenMeshPicked = true; }
    return function (target, propertyKey) {
        var _a;
        if (typeof (target[propertyKey]) !== "function") {
            throw new Error("Decorated propery \"" + propertyKey.toString() + "\" in class \"" + target.constructor.name + "\" must be a function.");
        }
        var ctor = target.constructor;
        ctor._PointerValues = (_a = ctor._PointerValues) !== null && _a !== void 0 ? _a : [];
        ctor._PointerValues.push({
            type: type,
            onlyWhenMeshPicked: onlyWhenMeshPicked,
            propertyKey: propertyKey.toString(),
        });
    };
}
exports.onPointerEvent = onPointerEvent;
/**
 * Sets the decorated member function to be called on the given keyboard key(s) is/are pressed.
 * @param key the key or array of key to listen to execute the decorated function.
 */
function onKeyboardEvent(key, type) {
    return function (target, propertyKey) {
        var _a;
        if (typeof (target[propertyKey]) !== "function") {
            throw new Error("Decorated propery \"" + propertyKey.toString() + "\" in class \"" + target.constructor.name + "\" must be a function.");
        }
        var ctor = target.constructor;
        ctor._KeyboardValues = (_a = ctor._KeyboardValues) !== null && _a !== void 0 ? _a : [];
        ctor._KeyboardValues.push({
            type: type,
            keys: Array.isArray(key) ? key : [key],
            propertyKey: propertyKey.toString(),
        });
    };
}
exports.onKeyboardEvent = onKeyboardEvent;
//# sourceMappingURL=decorators.js.map