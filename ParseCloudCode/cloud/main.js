// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
//request.params.uuid request.params.code response - number
Parse.Cloud.define("startNumberGame", function(request, response) {
            //deleting any old objects from this device
            //
            var query = new Parse.Query("GameObject");
            query.equalTo("uuid",
                request.params.id);
            query.find({
                    success: function(results) {
                        console.log("Found old objects, deleting...");
                        Parse.Object.destroyAll(results, {
                                success: function() {
                                    console.log("succeeded deleting " + results.length + " objects")
                                    createNewObjectAndReturn();
                                },
                                error: function(error) {
                                    console.error("Error deleting related results " + error.code + ": " + error.message);
                                    }
                                });
                        }

                ,
                error: function() {
                    console.log("nothing");
                }
            });
   
    //creating a new game object with type for numbergame and returning the
    //number to the device
    //
    //
    //
    //// 
    // numberGame.save(null, {
    //     success: function (listing) { console.log("Save ok");
    // 
    //         var query = new Parse.Query("GameObject");
    //         query.equalTo("code", request.params.code);
    //         query.ascending("date"); query.find({ success:
    //         function(results) { console.log("Found " + results); for(var
    //         i=0;i<results.length;i++) { if(results[i].get("uuid") ==
    //         request.params.id) { results[i].set("number",i+1);
    //         results[i].save(null, { success: function (listing) {
    //         console.log("Save ok after set number"); return
    //         response.success(i+1);
    //     },
    //     error: function (error) { response.error(error);
    //     console.error("Error saving new object " + error.code + ": " +
    //     error.message); console.log("Save ko after set number");
    //     response.error(-3);
    // //     }
    // });
    // }// 
    // }// //         }
    // }// //         }//       }
    //       	response.error(-2);
    // 
    //     },
    //     error: function() { response.error(-1);
    // //     }
    //   });
    //   }// 
    //   }// // 
    //   }// // // 
    //     },
    //     error: function (error) { response.error(error);
    //     console.error("Error saving new object " + error.code + ": " +
    //     error.message); console.log("Save ko"); response.error(-4);
    // //     }
    // });
    // }
    // }
    // }
    // }
function createNewObjectAndReturn() {
    var NumberGame = new
    Parse.Object.extend("GameObject");
    var numberGame = new NumberGame();
    numberGame.set("uuid", request.params.id);
    numberGame.set("code",
        request.params.code);
    var d = new Date();
    var n = d.getTime();
    numberGame.set("date", n);
    numberGame.set("type", "numbers");

    var query = new Parse.Query("GameObject");
    query.equalTo("code",
        request.params.code);
    query.ascending("number");
    query.find({
            success: function(results) {
                if (results.length > 0) {
                    console.log("found objects");
                    numberGame.set("number", results[results.length - 1].get("number") + 1);
                    numberGame.save();
                    response.success(results.length + 1);
                    console.log("Save ok");
                } else {
                    numberGame.set("number", 1);
                    numberGame.save(null, {
                        success: function(listing) {
                            console.log("Save ok");
                            response.success(1);
                        },
                        error: function() {
                            response.error(-1);
                        }
                    });
                }
},
error: function() {
response.error(-1);

}
});

}
});




Parse.Cloud.define("reportNumberclicked", function(request, response) {

    // var NumberGame = new Parse.Object.extend("GameObject"); var
    // numberGame = new NumberGame(); numberGame.set ("uuid",
    // request.params.id); numberGame.set("code", request.params.code); var
    // d = new Date(); var n = d.getTime(); numberGame.set("date", n);
    // numberGame.set("type", "numbers");
    var resultsclicked;
    var timestart = 0;
    var query = new Parse.Query("GameObject");
    query.equalTo("code",
        request.params.code);
    query.equalTo("uuid", request.params.id);
    query.find({
            success: function(resultsmyobject) {
				console.log("got my object");
                var myGameObject = resultsmyobject[0];

                var query = new Parse.Query("GameObject");
                query.equalTo("code",
                    request.params.code);
                query.equalTo("clicked", "yes");
                query.ascending("timeclicked");
                query.find({
                        success: function(results) {
                        console.log("got all clicked objects: "+ results.length);
                        resultsclicked = results;
                            var inorder = true;
                            for (var i = 0; i < results.length; i++) {
                            console.log("iterate " + i +" through");
                            if(i==0)
                            	timestart = results[0].get("date");
                                if (results[i].get("number") != i + 1) {
                                    response.error(-1);
                                    var inorder = false;
                                    break;
                                }
                            }
                             if (inorder) {
                             console.log("all ordered");
                        myGameObject.set("clicked", "yes");
                        var d = new Date();
                        var n = d.getTime();
                        myGameObject.set("timeclicked", n);
                        myGameObject.save(null, {
                                success: function(listing) {
                                    console.log("Save ok");
                                             var query = new Parse.Query("GameObject");
                							query.equalTo("code",  request.params.code);
                							query.find({
                        success: function(resultsall) {
                        console.log("finalizing game");
                        if(resultsclicked.length == resultsall.length)
                        {
                        console.log("game ended successfully");
                        //calcualte game time
                        var lasttime = results[resultsall.length-1].get("timeclicked");
                    	console.log("time: " + lasttime);
                    	
                    	var resultsJson = [];
                    	 //resultJson["time elapsed"] = lasttime-timestart;
                    	 resultsJson.push("time",lasttime-timestart);
                          response.success(resultsJson);	
                        }
                        else if(resultsclicked.length> myGameObject.get("number"))
                        {
                        	console.log("not all clicked");
                        	response.error(-1);
                        }
                        else
                        	response.success(0);
                        },
                        error : function ()
                        {
                        	console.log("Could not get all objects");
                        	response.error(-1);
                        }
                        });
                    
                                    // 
                                    // 
                                    //console.log("nothing happned");
                                    //response.success(-1);
                                },
                                error: function() {
                                console.log("failed to save object value");
                                    response.error(-1);
                                }
                                
                            
                        });
              }  
                            
                            
                            
                        },
                    error : function ()
                    {
                    	console.log("could not find clicked objects");
                    	response.error(-1);
                    }
                    });
                    
                   
                
        }    ,
        error : function()
        {
        	console.log("could not find my object");
        	response.error(-1);
        }
        
        });
       
    });





Parse.Cloud.define("startSelfiGame", function(request, response) {
            //deleting any old objects from this device
            //
            var query = new Parse.Query("GameObject");
            query.equalTo("uuid",
                request.params.id);
            query.find({
                    success: function(results) {
                        console.log("Found old objects, deleting...");
                        Parse.Object.destroyAll(results, {
                                success: function() {
                                    console.log("succeeded deleting " + results.length + " objects")
                                    createNewObjectAndReturn();
                                },
                                error: function(error) {
                                    console.error("Error deleting related results " + error.code + ": " + error.message);
                                    }
                                });
                        }

                ,
                error: function() {
                    console.log("nothing");
                }
            });
   
   
function createNewObjectAndReturn() {
    var SelfiGame = new Parse.Object.extend("GameObject");
    var selfiGame = new SelfiGame();
    selfiGame.set("uuid", request.params.id);
    selfiGame.set("code",
        request.params.code);
    var d = new Date();
    var n = d.getTime();
    selfiGame.set("date", n);
    selfiGame.set("type", "selfi");

 selfiGame.save(null, {
                        success: function(listing) {
                            console.log("Save ok");
                            response.success(JSON.stringify(selfiGame));
                           
                        },
                        error: function() {
                            response.error(-1);
                        }
                    });
                    
                    
                    
   
}



});