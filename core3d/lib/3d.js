define("buttonStyle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonStyle = void 0;
    class ButtonStyle {
        constructor() {
            this.primaryColor = new BABYLON.Color4();
            this.secondaryColor = new BABYLON.Color4();
            this.width = 30;
            this.height = 30;
            return;
        }
    }
    exports.ButtonStyle = ButtonStyle;
});
define("guiConfiguration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GUIConfiguration = void 0;
    class GUIConfiguration {
        constructor() {
            this.button_style_height = 30;
            this.button_style_width = 30;
            this.button_style_offset = 10;
            return;
        }
    }
    exports.GUIConfiguration = GUIConfiguration;
});
define("modelStyleData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModelStyleData = void 0;
    class ModelStyleData {
        constructor() {
            this.name = "style";
            this.primary_color = new BABYLON.Color4();
            this.secondary_color = new BABYLON.Color4();
            this.diffuse_map_name = "";
            return;
        }
    }
    exports.ModelStyleData = ModelStyleData;
});
define("modelConfiguration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModelConfiguration = void 0;
    class ModelConfiguration {
        constructor() {
            this.asset_path = "";
            this.model_folder = "";
            this.model_name = "";
            this.styles = new Array();
            return;
        }
    }
    exports.ModelConfiguration = ModelConfiguration;
});
define("gameStart", ["require", "exports", "guiConfiguration", "modelConfiguration", "modelStyleData"], function (require, exports, guiConfiguration_1, modelConfiguration_1, modelStyleData_1) {
    "use strict";
    class GameStart {
        constructor() { return; }
        start() {
            let guiConfiguration = new guiConfiguration_1.GUIConfiguration();
            guiConfiguration.button_style_height = 40;
            guiConfiguration.button_style_width = 40;
            guiConfiguration.button_style_offset = 20;
            let modelConfiguration = new modelConfiguration_1.ModelConfiguration();
            modelConfiguration.asset_path = "core3d/src/assets/3DModels/";
            modelConfiguration.model_folder = "Sneaker_SM";
            modelConfiguration.model_name = "PB170_Sneaker_Sm";
            let styleA = new modelStyleData_1.ModelStyleData();
            styleA.name = "styleA";
            styleA.diffuse_map_name = "PB170_Sneaker_Sm_diffuse.jpg";
            styleA.primary_color.set(1.0, 0.0, 0.0, 1.0);
            modelConfiguration.styles.push(styleA);
            let styleB = new modelStyleData_1.ModelStyleData();
            styleB.name = "styleB";
            styleB.diffuse_map_name = "PB170_Sneaker_Sm_diffuse_pink.jpg";
            styleB.primary_color.set(1.0, 0.22, 0.6, 1.0);
            modelConfiguration.styles.push(styleB);
            let styleC = new modelStyleData_1.ModelStyleData();
            styleC.name = "styleC";
            styleC.diffuse_map_name = "PB170_Sneaker_Sm_diffuse_blue.jpg";
            styleC.primary_color.set(0.0, 0.37, 1.0, 1.0);
            modelConfiguration.styles.push(styleC);
            let canvas = document.getElementById('renderCanvas');
            let babylon = new BABYLON.Engine(canvas, true);
            let scene = new BABYLON.Scene(babylon);
            let camera = new BABYLON.ArcRotateCamera('Camera,', Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(5, 5, -5), scene);
            camera.attachControl(canvas);
            this._m_root = new BABYLON.TransformNode("root", scene);
            camera.target = this._m_root.position;
            let light_1 = new BABYLON.HemisphericLight('light_1', new BABYLON.Vector3(1, 1, 0), scene);
            this.initScene(scene, canvas, modelConfiguration, guiConfiguration);
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
        initScene(_scene, _canvas, _modelConfiguration, _guiConfiguration) {
            this._m_hMaterials = new Map();
            this.loadMaterials(_scene, _modelConfiguration);
            let self = this;
            BABYLON.SceneLoader.ImportMesh("", _modelConfiguration.asset_path + _modelConfiguration.model_folder + "/", _modelConfiguration.model_name
                + ".babylon", _scene, function (_aMesh) {
                let size = _aMesh.length;
                let index = 0;
                while (index < size) {
                    self._m_model = _aMesh[index];
                    if (!self._m_model.parent) {
                        self._m_model.parent = self._m_root;
                    }
                    ++index;
                }
                let objMaterial = self._m_model.material;
                objMaterial.metallicTexture = new BABYLON.Texture(_modelConfiguration.asset_path
                    + _modelConfiguration.model_folder
                    + "/"
                    + _modelConfiguration.model_name
                    + "_roughness.jpg", _scene);
                objMaterial.metallic = 0;
                objMaterial.roughness = 1;
                return;
            });
            let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('myUI');
            this.createStyleUI(_modelConfiguration.styles, advancedTexture, _canvas, _guiConfiguration.button_style_width, _guiConfiguration.button_style_height, _guiConfiguration.button_style_offset);
            return;
        }
        loadMaterials(_scene, _modelConfiguration) {
            let index = 0;
            let size = _modelConfiguration.styles.length;
            let modelStyle;
            while (index < size) {
                modelStyle = _modelConfiguration.styles[index];
                let texture = new BABYLON.Texture(_modelConfiguration.asset_path
                    + _modelConfiguration.model_folder
                    + "/"
                    + modelStyle.diffuse_map_name, _scene);
                this._m_hMaterials.set(modelStyle.name, texture);
                ++index;
            }
            return;
        }
        createStyleUI(_aButtonStyles, _advancedTexture, _canvas, _button_w, _button_h, _offset) {
            let aButtons = this.createStyleButtons(_aButtonStyles, _advancedTexture, _button_w, _button_h);
            this.orderButtons(aButtons, _canvas.width, _canvas.height, _button_w, _button_h, _offset);
            return;
        }
        createStyleButtons(_aButtonStyles, _advancedTexture, _button_w, _button_h) {
            let index = 0;
            let size = _aButtonStyles.length;
            let aButtons = new Array();
            while (index < size) {
                let buttonStyle;
                buttonStyle = _aButtonStyles[index];
                let button = this.createStyleButton(_advancedTexture, buttonStyle.primary_color, buttonStyle.secondary_color, _button_w, _button_h);
                let self = this;
                button.onPointerClickObservable.add(function (_eventData) {
                    self.setStyle(buttonStyle.name);
                    return;
                });
                aButtons.push(button);
                ++index;
            }
            return aButtons;
        }
        setStyle(_name) {
            if (this._m_hMaterials.has(_name)) {
                if (this._m_model) {
                    let pbrMaterial = this._m_model.material;
                    pbrMaterial.albedoTexture = this._m_hMaterials.get(_name);
                }
            }
            return;
        }
        orderButtons(_aButtons, _scene_w, _scene_h, _button_w, _button_h, _button_offset) {
            let index = 0;
            let size = _aButtons.length;
            let left = (_scene_w - _button_w) * 0.5 - _button_offset;
            let top = (_scene_h - _button_h) * 0.5 - _button_offset;
            while (index < size) {
                _aButtons[index].left = left.toString() + "px";
                _aButtons[index].top = top.toString() + "px";
                left -= (_button_offset + _button_w);
                ++index;
            }
            return;
        }
        createStyleButton(_advancedTexture, _primaryColor, _secondaryColor, _button_w, _button_h) {
            let primaryColorFilter = new BABYLON.GUI.Rectangle('primaryFilter');
            primaryColorFilter.background = _primaryColor.toHexString();
            primaryColorFilter.cornerRadius = _button_w * 0.5;
            let button = new BABYLON.GUI.Button("styleButton");
            button.addControl(primaryColorFilter);
            button.width = _button_w.toString() + "px";
            button.height = _button_h.toString() + "px";
            button.thickness = 0;
            _advancedTexture.addControl(button);
            return button;
        }
    }
    return GameStart;
});
//# sourceMappingURL=3d.js.map