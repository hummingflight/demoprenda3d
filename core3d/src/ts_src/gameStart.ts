import { GUIConfiguration } from "./guiConfiguration";
import { ModelConfiguration } from "./modelConfiguration";
import { ModelStyleData } from "./modelStyleData";

class GameStart
{
  /****************************************************/
  /* Public                                           */
  /****************************************************/

  constructor()
  { return; }

  start()
  {
    ///////////////////////////////////
    // HardCode GUI Configuration

    let guiConfiguration : GUIConfiguration
      = new GUIConfiguration();

    guiConfiguration.button_style_height = 40;

    guiConfiguration.button_style_width = 40;

    guiConfiguration.button_style_offset = 20;

    ///////////////////////////////////
    // HardCode Model Configuration

    let modelConfiguration : ModelConfiguration
      = new ModelConfiguration();

    modelConfiguration.asset_path = "./core3D/src/assets/3DModels/";

    modelConfiguration.model_folder = "Sneaker_SM";

    modelConfiguration.model_name = "PB170_Sneaker_Sm";

    ///////////////////////////////////
    // Model Styles

    let styleA : ModelStyleData = new ModelStyleData();

    styleA.name = "styleA";

    styleA.diffuse_map_name = "PB170_Sneaker_Sm_diffuse.jpg";

    styleA.primary_color.set(1.0, 0.0, 0.0, 1.0);

    modelConfiguration.styles.push(styleA);

    let styleB : ModelStyleData = new ModelStyleData();

    styleB.name = "styleB";

    styleB.diffuse_map_name = "PB170_Sneaker_Sm_diffuse_pink.jpg";

    styleB.primary_color.set(1.0, 0.22, 0.6, 1.0);

    modelConfiguration.styles.push(styleB);

    let styleC : ModelStyleData = new ModelStyleData();

    styleC.name = "styleC";

    styleC.diffuse_map_name = "PB170_Sneaker_Sm_diffuse_blue.jpg";

    styleC.primary_color.set(0.0, 0.37, 1.0, 1.0);

    modelConfiguration.styles.push(styleC);

    ///////////////////////////////////
    // Start Engine

    // Get the HTML canvas

    let canvas : HTMLCanvasElement 
      = document.getElementById('renderCanvas') as HTMLCanvasElement;

    // Start Babylon engine.

    let babylon : BABYLON.Engine = new BABYLON.Engine(canvas, true);

    ///////////////////////////////////
    // Create Scene

    let scene = new BABYLON.Scene(babylon);

    let camera = new BABYLON.ArcRotateCamera
    (
      'Camera,',
      Math.PI / 2,
      Math.PI / 2,
      2,
      new BABYLON.Vector3(5, 5 , -5),
      scene
    );

    // Attach controls to camera

    camera.attachControl(canvas);

    this._m_root = new BABYLON.TransformNode("root", scene);

    camera.target = this._m_root.position;

    // Create a hemispheric Light

    let light_1 = new BABYLON.HemisphericLight
    (
      'light_1',
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    ///////////////////////////////////
    // Init Scene

    this.initScene
    (
      scene, 
      canvas, 
      modelConfiguration, 
      guiConfiguration
    );

    ///////////////////////////////////
    // Background

    let background = new BABYLON.Layer
    (
      "hf_background", 
      "core3d/src/assets/textures/hf_bg_0.png", 
      scene
    );
    
    background.isBackground = true;

    ///////////////////////////////////
    // Game Loop

    babylon.runRenderLoop
    (
      function()
      {
        scene.render();
        return;
      }
    )

    ///////////////////////////////////
    // Resize events

    window.addEventListener
    (
      'resize', 
      function()
      {
        babylon.resize();
        return;
      }
    );

    return;
  }

  initScene
  (
    _scene : BABYLON.Scene,
    _canvas : HTMLCanvasElement,
    _modelConfiguration : ModelConfiguration,
    _guiConfiguration : GUIConfiguration
  )
  {
    /****************************************************/
    /* Materials                                        */
    /****************************************************/

    this._m_hMaterials = new Map<string, BABYLON.Texture>();

    this.loadMaterials(_scene, _modelConfiguration);

    /****************************************************/
    /* 3D Model                                         */
    /****************************************************/    

    let self = this;

    BABYLON.SceneLoader.ImportMesh
    (
      "",
      _modelConfiguration.asset_path + _modelConfiguration.model_folder + "/",      
      _modelConfiguration.model_name 
      + ".babylon",
      _scene,
      function(_aMesh : BABYLON.AbstractMesh[])
      {
        // Get ship mesh from array.
      
        let size : number = _aMesh.length;
      
        let index : number = 0;

        while(index < size)
        {
          self._m_model = _aMesh[index];

          if(!self._m_model.parent)
          {
            self._m_model.parent = self._m_root;
          }
        
          ++index;
        }

        // Get Mesh Material

        let objMaterial : BABYLON.PBRMaterial 
          = self._m_model.material as BABYLON.PBRMaterial;

        // Set the Roughness Material

        objMaterial.metallicTexture = new BABYLON.Texture
        (
          _modelConfiguration.asset_path 
          + _modelConfiguration.model_folder
          + "/"
          + _modelConfiguration.model_name 
          + "_roughness.jpg",
          _scene
        );

        objMaterial.metallic = 0;

        objMaterial.roughness = 1;

        return;
      }
    );

    /****************************************************/
    /* UI                                               */
    /****************************************************/

    // UI Canvas

    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI
    (
      'myUI'
    );

    this.createStyleUI
    (
      _modelConfiguration.styles,
      advancedTexture,
      _canvas,
      _guiConfiguration.button_style_width,
      _guiConfiguration.button_style_height,
      _guiConfiguration.button_style_offset
    );

    return;
  }

  loadMaterials
  (
    _scene : BABYLON.Scene,
    _modelConfiguration : ModelConfiguration
  )
  : void
  {
    let index : number = 0;

    let size : number = _modelConfiguration.styles.length;

    let modelStyle : ModelStyleData;

    while(index < size)
    {
      // Create Material

      modelStyle = _modelConfiguration.styles[index];

      let texture : BABYLON.Texture = new BABYLON.Texture
      (
        _modelConfiguration.asset_path 
        + _modelConfiguration.model_folder 
        + "/" 
        + modelStyle.diffuse_map_name,
        _scene
      );

      this._m_hMaterials.set(modelStyle.name, texture);

      ++index;
    }

    return;
  }

  createStyleUI
  (
    _aButtonStyles : Array<ModelStyleData>,
    _advancedTexture : BABYLON.GUI.AdvancedDynamicTexture,
    _canvas : HTMLCanvasElement,
    _button_w : number,
    _button_h : number,
    _offset : number
  )
  : void
  {
    // Create style buttons

    let aButtons : Array<BABYLON.GUI.Button>
      = this.createStyleButtons
      (
        _aButtonStyles, 
        _advancedTexture,
        _button_w,
        _button_h
      );

    // Order style buttons

    this.orderButtons
    (
      aButtons, 
      _canvas.width, 
      _canvas.height,
      _button_w,
      _button_h,
      _offset
    );

    return;
  }

  createStyleButtons
  (
    _aButtonStyles : Array<ModelStyleData>,
    _advancedTexture : BABYLON.GUI.AdvancedDynamicTexture,
    _button_w : number,
    _button_h : number
  )
  : Array<BABYLON.GUI.Button>
  {

    let index : number = 0;
    
    let size : number = _aButtonStyles.length;

    let aButtons = new Array<BABYLON.GUI.Button>();    

    while(index < size)
    {
      // Get button style

      let buttonStyle : ModelStyleData;

      buttonStyle = _aButtonStyles[index];

      // Create button

      let button : BABYLON.GUI.Button = this.createStyleButton
      (
        _advancedTexture,
        buttonStyle.primary_color,
        buttonStyle.secondary_color,
        _button_w,
        _button_h
      );

      // events

      let self = this;

      button.onPointerClickObservable.add
      (
        function(_eventData : BABYLON.GUI.Vector2WithInfo)
        {
          
          self.setStyle(buttonStyle.name);

          return;
        }
      );

      // Add button

      aButtons.push(button);      

      ++index;
    }

    return aButtons;
  }

  setStyle(_name : string)
  : void
  {
    
    if(this._m_hMaterials.has(_name))
    {
      if(this._m_model)
      {

        let pbrMaterial = this._m_model.material as BABYLON.PBRMaterial;

        pbrMaterial.albedoTexture = this._m_hMaterials.get(_name);
      }
    }

    return;
  }

  orderButtons
  (
    _aButtons : Array< BABYLON.GUI.Button>,
    _scene_w : number,
    _scene_h : number,
    _button_w : number,
    _button_h : number,
    _button_offset : number
  )
  : void
  {
    let index : number = 0;

    let size = _aButtons.length;

    let left : number = (_scene_w - _button_w) * 0.5 - _button_offset;

    let top : number = (_scene_h - _button_h) * 0.5 - _button_offset;

    while(index < size)
    {       
      _aButtons[index].left = left.toString() + "px";
      _aButtons[index].top = top.toString() + "px";

      left -= (_button_offset + _button_w);

      ++index;
    }

    return;
  }

  createStyleButton
  (
    _advancedTexture : BABYLON.GUI.AdvancedDynamicTexture,
    _primaryColor : BABYLON.Color4,
    _secondaryColor : BABYLON.Color4,
    _button_w : number,
    _button_h : number
  )
  : BABYLON.GUI.Button
  {
    ///////////////////////////////////
    // Primary Color Image

    // Color Filter

    let primaryColorFilter : BABYLON.GUI.Rectangle 
      = new BABYLON.GUI.Rectangle('primaryFilter');    

    primaryColorFilter.background = _primaryColor.toHexString();
    primaryColorFilter.cornerRadius = _button_w * 0.5;

    // Button

    let button : BABYLON.GUI.Button = new BABYLON.GUI.Button("styleButton");

    button.addControl(primaryColorFilter);

    button.width = _button_w.toString() + "px";
    button.height = _button_h.toString() + "px";

    button.thickness = 0;

    _advancedTexture.addControl(button);

    return button;
  }

  ///////////////////////////////////
  // private

  private _m_root : BABYLON.TransformNode;

  private _m_model : BABYLON.AbstractMesh;

  private _m_hMaterials : Map<string, BABYLON.Texture>;
}

export = GameStart;