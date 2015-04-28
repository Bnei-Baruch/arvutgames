/* global device, Parse */

//Parse related keys
var PARSE_APP = "Y3kKMKJl3H2V9ozFAJ2xaWcyHfXxGKGO8tSnANTB";
var PARSE_JS = "8JNxFImF0zWQKJNt66sryAM7fEROK9caqtLxtXuS";

$(document).ready(function () {

   document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
    // Handle the back button
     setTimeout(function () {
                // do your thing here!
                alert("Back clicked", "Error");
            }, 0);
    }
    $(document).on("pagebeforeshow", "#one2ten", function () {

        $("#numberBtn").button({icons: {primary: 'login-icon'}, text: true});
        $("#codeTitle").closest('.ui-input-text').show();
        $("#addCodeBtn").closest('.ui-btn').show();
        $("#numberBtn").closest('.ui-btn').hide();
    });
    $(document).on("pagebeforeshow", "#groupselfie", function () {

       
        $.mobile.changePage('#groupselfie', {reverse: false, changeHash: false});

    });
    
    
    
function checkforImagesCompletion()
{
    
     var query = new Parse.Query("GameObject");
                                query.equalTo("code",code);
                                var countImageObjects=0;
                                query.find({
                                    success: function (results) {
                                        for(var i=0;i<results.length;i++)
                                        {
                                            var object = results[i];
                                            if(object.get("image")!==null)
                                                countImageObjects++;
                                        }
                                        if(countImageObjects==results.length)
                                        {
                                            //create collage
                                            loadimages(results);
                                        }
                                        else
                                            checkforImagesCompletion();
                                            
                                    },
                                    error: function () {
                                        response.error(-1);

                                    }
                                });
}


function takepicture(code)
    {
        
        if (!navigator.camera) {
            setTimeout(function () {
                // do your thing here!
                alert("Camera API not supported", "Error");
            }, 0);

            return;
        }
        var options = {quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0, // 0=JPG 1=PNG
            saveToPhotoAlbum: false
        };

        navigator.camera.getPicture(
                function (imgData) {
                    var image = document.getElementById('largeImage');

                    console.log("imgData: " + imgData);
                    image.style.display = 'block';
                    image.src = "data:image/jpeg;base64," + imgData;

                    
        
                    
                   
                    var GameObject = Parse.Object.extend("GameObject");
                    var gameObject = new GameObject();
                    gameObject.set("code", code);
                    gameObject.set("uuid", device.uuid);
                    gameObject.set("type", "selfi");
                    var parseFile = new Parse.File("image", {base64: imgData});
                 
                    //put this inside if {
                    parseFile.save().then(function () {
                        // The file has been saved to Parse.
                        gameObject.set("image", parseFile);



                        gameObject.save(null, {
                            success: function (gameObject) {
                                // Execute any logic that should take place after the object is saved.
                                alert('New object created with objectId: ' + gameObject.id);

                                //get all objects from server in loop mode untill all pictures are set and create a collage
                                var query = new Parse.Query("GameObject");
                                query.equalTo("code",code);
                                var countImageObjects=0;
                                query.find({
                                    success: function (results) {
                                        for(var i=0;i<results.length;i++)
                                        {
                                            var object = results[i];
                                            if(object.get("image")!==null)
                                                countImageObjects++;
                                        }
                                        if(countImageObjects==results.length)
                                        {
                                            //create collage
                                            loadimages(results);
                                        }
                                        else
                                            checkforImagesCompletion();
                                            
                                    },
                                    error: function () {
                                        response.error(-1);

                                    }
                                });










                            },
                            error: function (gameObject, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                                alert('Failed to create new object, with error code: ' + error.message);
                            }
                        });


                    }, function (error) {
                        // The file either could not be read, or could not be saved to Parse.

                    });




                },
                function () {
                    setTimeout(function () {
                        // do your thing here!
                        alert('Error taking picture', 'Error');
                    }, 0);

                },
                options);

    }
    ;
    function startNumberGame() {


    }
    ;
    Parse.initialize(PARSE_APP, PARSE_JS);
    

    $("#numberBtn").on("touchend click", function (e) {
        var code = $("#codeTitle").val();
        
        var uuid = device.uuid;
        //var number = $("#numberBtn").text();
        Parse.Cloud.run('reportNumberclicked', {code: code, id: uuid}, {
            success: function (result) {

                console.log(result);
                // var obj = JSON.parse(result);
                if (result != 0) {
                    // Audio player
                    //ios  = media/SleepAway.mp3
                    //android = /android_asset/www/media/SleepAway.mp3
                    var test = function () {
                        var src;
                        if (device.platform == "Android")
                            src = "/android_asset/www/media/SleepAway.mp3";
                        else if (device.platform == "iOS")
                            src = "media/SleepAway.mp3";

                        media = new Media(src, onSuccess, onError);
                        media.play({numberOfLoops: 1});
                    };
                    alert(result);
                    test();
                }
            },
            error: function (error) {

                alert("game not succeeded: " + error.message)
            }
        });

        // onSuccess Callback
        function onSuccess() {
            console.log("playAudio():Audio Success");
        }

        // onError Callback 
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
        }


    });
    $("#addCodeBtn").on("touchend click", function (e) {
        e.preventDefault();

        //Grab the note details, no real validation for now
        code = $("#codeTitle").val();
        
        
        var uuid = device.uuid;

        Parse.Cloud.run('startNumberGame', {code: code, id: uuid}, {
            success: function (number) {

                //should read the number got from server

                 var button = $("#addCodeBtn");
                $("#codeTitle").closest('.ui-input-text').hide();
                $("#addCodeBtn").closest('.ui-btn').hide();
                //if($("#numberBtn").length)
                $("#numberBtn").closest('.ui-btn').show();
//                        else if($("#groupselfie").length)
//                        {
//                            takepicture(code);
//                            
//                        }
                $("#numberBtn").prop('text', number);       
//$("#numberBtn").closest('.ui-btn').button().refresh();
                $("#numberBtn").text(number).button("refresh");
button('refresh');
// already initialized - find innerTextSpan and change its label    



            },
            error: function (error) {
            }
        });










//		var note = new NoteObject();
//		note.save({code:code}, {
//			success:function(object) {
//				console.log("Saved the object!");
//				$("#noteTitle").val("");
//				$("#noteBody").val("");
//				getNotes();
//			}, 
//			error:function(object,error) {
//				console.dir(error);
//				alert("Sorry, I couldn't save it.");
//			}
//		});
    });

    $("#addCodeBtnSelfie").on("touchend click", function (e) {
        e.preventDefault();

        //Grab the note details, no real validation for now
        code = $("#codeTitle").val();
        
        
        
        Parse.Cloud.run('startselfiGame', {code: code, id: uuid}, {
            success: function (selfi) {

                //should read the number got from server

                // var button = $("#addCodeBtn");
                $("#codeTitle").closest('.ui-input-text').hide();
                $("#addCodeBtnSelfie").closest('.ui-btn').hide();
                $("#addCodeBtnSelfie").button("refresh");
                takepicture(code);





            },
            error: function (error) {
            }
        });










//		var note = new NoteObject();
//		note.save({code:code}, {
//			success:function(object) {
//				console.log("Saved the object!");
//				$("#noteTitle").val("");
//				$("#noteBody").val("");
//				getNotes();
//			}, 
//			error:function(object,error) {
//				console.dir(error);
//				alert("Sorry, I couldn't save it.");
//			}
//		});
    });

 $("#back-selfi").on("touchend click", function (e) {

        back();
    });
    $("#back-one2ten").on("touchend click", function (e) {

        back();
    });


function back()
{
    console.log("back clicked");
        //reset my number
       //var code = $("#codeTitle").val();
        
        
        var uuid = device.uuid;
        var query = new Parse.Query("GameObject");
        //query.equalTo("code", code);
        query.equalTo("uuid", uuid);
        query.find({
            success: function (results) {
                for(var i=0;i<results.length;i++)
                {
                results[i].destroy(results, {
                    success: function () {
                        console.log("succeeded deleting " + results.length + " objects")
                        
                    },
                    error: function (error) {
                        console.error("Error deleting related results " + error.code + ": " + error.message);
                    }
                });
                        }


            },
            error: function () {
                console.error("could not find object");
            }


        });
}
    function loadimages(parseObjects) {

        'use strict';
		var $ = window.jQuery;
        var $progress, $status;
        var supportsProgress;
        var loadedImageCount, imageCount;

        $(function () {
            var $demo = $('#groupselfie');
            var $container = $demo.find('#image-container');
            $status = $demo.find('#status');
            

           

           // $('#add').click(function () {
                // add new images
                var items = getItems(parseObjects);
                console.log(items);
                $container.prepend($(items));
                // use ImagesLoaded
//                $container.imagesLoaded()
//                        .progress(onProgress)
//                        .always(onAlways);
//                        
//                        
                    
                // reset progress counter
                //imageCount = $container.find('img').length;
               // resetProgress();
               // updateProgress(0);
          //  });

            // reset container
           //  $('#reset').click(function () {
//                 $container.empty();
//             });
        });

// -----  ----- //

// return doc fragment with
        function getItems(parseObjects) {
            var items = '';
            for (var i = 0; i < parseObjects.length; i++) {
                items += getImageItem(parseObjects[i]);
                if((i+1)%3==0 )
                    items+='<p></p>';
                    
            }
            return items;
        }

// return an <li> with a <img> in it
        function getImageItem(parseObject) {
            //var item ;//= '<li class="is-loading">';
           //  var size = Math.random() * 3 + 1;
//             var width = Math.random() * 110 + 100;
//             width = Math.round(width * size);
//             var height = Math.round(140 * size);
//             var rando = Math.ceil(Math.random() * 1000);
            // 10% chance of broken image src
            // random parameter to prevent cached images
            var image = parseObject.get("image");
            alert("image url: "+ image.url());
            var src = image.url();//rando < 100 ? '//foo/broken-' + rando + '.jpg' :
                    // use lorempixel for great random images
//                     '//lorempixel.com/' + width + '/' + height + '/' + '?' + rando;
            var item = '<img src="' + src + '" style="width:30%;"/>';
            return item;
        }

// -----  ----- //

        function resetProgress() {
            $status.css({opacity: 1});
            loadedImageCount = 0;
            if (supportsProgress) {
                $progress.attr('max', imageCount);
            }
        }

        function updateProgress(value) {
            if (supportsProgress) {
                $progress.attr('value', value);
            } else {
                // if you don't support progress elem
                $status.text(value + ' / ' + imageCount);
            }
        }

// triggered after each item is loaded
        function onProgress(imgLoad, image) {
            // change class if the image is loaded or broken
            var $item = $(image.img).parent();
            $item.removeClass('is-loading');
            if (!image.isLoaded) {
                $item.addClass('is-broken');
            }
            // update progress element
            loadedImageCount++;
            updateProgress(loadedImageCount);
        }

// hide status when done
        function onAlways() {
            $status.css({opacity: 0});
        }

    };



});

