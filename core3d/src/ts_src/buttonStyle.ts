export class ButtonStyle 
{  
  /****************************************************/
  /* Public                                           */
  /****************************************************/
 
  constructor()
  {
    this.primaryColor = new BABYLON.Color4();

    this.secondaryColor = new BABYLON.Color4();

    this.width = 30;

    this.height = 30;

    return;
  }

  public primaryColor : BABYLON.Color4;

  public secondaryColor : BABYLON.Color4;

  public width : number;

  public height : number;
}