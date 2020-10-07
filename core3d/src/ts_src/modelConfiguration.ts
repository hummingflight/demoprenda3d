import { ModelStyleData } from "./modelStyleData";

export class ModelConfiguration
{
  /****************************************************/
  /* Public                                           */
  /****************************************************/
  
  constructor()
  {
    this.asset_path = "";

    this.model_folder = "";

    this.model_name = "";

    this.styles = new Array<ModelStyleData>();

    return;
  }
  
  public asset_path : string;

  public model_folder : string;

  public model_name : string;

  public styles : Array<ModelStyleData>;
}