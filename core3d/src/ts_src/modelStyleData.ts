export class ModelStyleData
{
  /****************************************************/
  /* Public                                           */
  /****************************************************/
  
  constructor()
  {
    this.name = "style";

    this.primary_color = new BABYLON.Color4();

    this.secondary_color = new BABYLON.Color4();

    this.diffuse_map_name = "";

    return;
  }

  name : string;

  primary_color : BABYLON.Color4;

  secondary_color : BABYLON.Color4;

  diffuse_map_name : string;
}