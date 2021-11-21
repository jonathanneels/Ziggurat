import { PointerEventTypes, KeyboardEventTypes } from "@babylonjs/core";
export declare type VisiblityPropertyType = "number" | "string" | "boolean" | "Vector2" | "Vector3" | "Vector4" | "Color3" | "Color4" | "KeyMap";
/**
 * Sets the decorated member visible in the inspector.
 * @param type the property type.
 * @param name optional name to be shown in the editor's inspector.
 * @param defaultValue optional default value set in the TS code.
 */
export declare function visibleInInspector(type: VisiblityPropertyType, name?: string, defaultValue?: any): any;
/**
 * Sets the decorated member linked to a child node.
 * @param nodeName defines the name of the node in children to retrieve.
 */
export declare function fromChildren(nodeName?: string): any;
/**
 * Sets the decorated member linked to a node in the scene.
 * @param nodeName defines the name of the node in the scene to retrieve.
 */
export declare function fromScene(nodeName?: string): any;
/**
 * Sets the decorated member linked to a particle system which has the current Mesh attached.
 * @param particleSystemname the name of the attached particle system to retrieve.
 */
export declare function fromParticleSystems(particleSystemname?: string): any;
/**
 * Sets the decorated member function to be called on the given pointer event is fired.
 * @param type the event type to listen to execute the decorated function.
 * @param onlyWhenMeshPicked defines wether or not the decorated function should be called only when the mesh is picked. default true.
 */
export declare function onPointerEvent(type: PointerEventTypes, onlyWhenMeshPicked?: boolean): any;
/**
 * Sets the decorated member function to be called on the given keyboard key(s) is/are pressed.
 * @param key the key or array of key to listen to execute the decorated function.
 */
export declare function onKeyboardEvent(key: number | number[] | string | string[], type?: KeyboardEventTypes): any;
