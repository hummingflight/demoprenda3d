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

    // Create a hemispheric Light

    let light_1 = new BABYLON.HemisphericLight
    (
      'light_1',
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    ///////////////////////////////////
    // 3D Model

    let root = new BABYLON.TransformNode('model');

    camera.target = root.position;

    BABYLON.SceneLoader.ImportMesh
    (
      "",
      "core3d/src/assets/3DModels/",
      "meshTest.babylon",
      scene,
      function(_aMesh : BABYLON.AbstractMesh[])
      {
        // Get ship mesh from array.

        let size : number = _aMesh.length;

        let index : number = 0;

        let mesh : BABYLON.AbstractMesh;

        while(index < size)
        {
          mesh = _aMesh[index];

          if(!mesh.parent)
          {
            mesh.parent = root;
          }

          ++index;
        }

        return;
      }
    );

    ///////////////////////////////////
    // UI    

    // UI Canvas

    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI
    (
      'myUI'
    );

    // 360 View icon

    var viewIcon = new BABYLON.GUI.Image
    (
      "360_icon", 
      "core3d/src/assets/textures/hf_360_view.png"
    );

    viewIcon.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    viewIcon.stretch = BABYLON.GUI.Image.STRETCH_NONE;
    
    viewIcon.width = "50px";

    viewIcon.height = "50px";

    advancedTexture.addControl(viewIcon);

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
}

export = GameStart;