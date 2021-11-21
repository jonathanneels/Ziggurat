"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
require("@babylonjs/materials");
var scene_1 = require("./scenes/scene");
var Game = /** @class */ (function () {
    /**
     * Constructor.
     */
    function Game() {
        this.engine = new core_1.Engine(document.getElementById("renderCanvas"), true);
        this.scene = new core_1.Scene(this.engine);
        this._bindEvents();
        this._load();
    }
    /**
     * Loads the first scene.
     */
    Game.prototype._load = function () {
        var _this = this;
        var rootUrl = "./scenes/scene/";
        core_1.SceneLoader.Append(rootUrl, "scene.babylon", this.scene, function () {
            _this.scene.executeWhenReady(function () {
                // Attach camera.
                if (!_this.scene.activeCamera) {
                    throw new Error("No camera defined in the scene. Please add at least one camera in the project or create one yourself in the code.");
                }
                _this.scene.activeCamera.attachControl(_this.engine.getRenderingCanvas(), false);
                // Run the scene to attach scripts etc.
                scene_1.runScene(_this.scene, rootUrl);
                // Render.
                _this.engine.runRenderLoop(function () { return _this.scene.render(); });
            });
        }, undefined, function (_, message) {
            console.error(message);
        }, "babylon");
    };
    /**
     * Binds the required events for a full experience.
     */
    Game.prototype._bindEvents = function () {
        var _this = this;
        window.addEventListener("resize", function () { return _this.engine.resize(); });
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=index.js.map