define("gameStart", ["require", "exports"], function (require, exports) {
    "use strict";
    class GameStart {
        constructor() { return; }
        start() {
            let canvas = document.getElementById('renderCanvas');
            let babylon = new BABYLON.Engine(canvas, true);
            let scene = new BABYLON.Scene(babylon);
            let camera = new BABYLON.ArcRotateCamera('Camera,', Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(5, 5, -5), scene);
            camera.attachControl(canvas);
            let light_1 = new BABYLON.HemisphericLight('light_1', new BABYLON.Vector3(1, 1, 0), scene);
            let root = new BABYLON.TransformNode('model');
            camera.target = root.position;
            BABYLON.SceneLoader.ImportMesh("", "core3d/src/assets/3DModels/", "meshTest.babylon", scene, function (_aMesh) {
                let size = _aMesh.length;
                let index = 0;
                let mesh;
                while (index < size) {
                    mesh = _aMesh[index];
                    if (!mesh.parent) {
                        mesh.parent = root;
                    }
                    ++index;
                }
                return;
            });
            let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('myUI');
            var viewIcon = new BABYLON.GUI.Image("360_icon", "core3d/src/assets/textures/hf_360_view.png");
            viewIcon.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            viewIcon.stretch = BABYLON.GUI.Image.STRETCH_NONE;
            viewIcon.width = "50px";
            viewIcon.height = "50px";
            advancedTexture.addControl(viewIcon);
            let background = new BABYLON.Layer("hf_background", "core3d/src/assets/textures/hf_bg_0.png", scene);
            background.isBackground = true;
            babylon.runRenderLoop(function () {
                scene.render();
                return;
            });
            window.addEventListener('resize', function () {
                babylon.resize();
                return;
            });
            return;
        }
    }
    return GameStart;
});
//# sourceMappingURL=3d.js.map