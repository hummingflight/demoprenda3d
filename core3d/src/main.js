
(function () 
{
  'use strict';

  let hostname = window.location.hostname;

  let pre = "";

  if(hostname === "hummingflight.github.io")
  {
    pre = "/demoprenda3d";
  }
  
  requirejs.config({
    
    baseUrl: "/",    

    paths: 
    {
      'gameStart' : pre + '/core3d/lib/3d'
    }
    
  });

  define(["require", "gameStart"],function(require, GameStart) 
  { 
    // Create a new instance.

    var gameStart = new GameStart();
    
    // Start application.
    
    gameStart.start();
    
    return;
  });

}());