var app = new Application();

function Application(){

	var self = this;
	var api = new APIhandler();
    var selectedPokemon;
    var triggerCell = 'load';
    var number = 1;
    var allPokemon = [];
    var onPokemonListPage = true;
    
    //background-position:0 -100px;
   
    self.onDeviceReady = function() {
        self.addBatteryListeners();
        self.addTapEventsToList();
        self.addPageEvents();
        self.updateUsername();
        $('#pokemon-list').append('<li><img src="./img/pokeball_loading.gif" id="load-image"></img></li>');
        $('#pokemon-list').listview('refresh');
        self.requestNewPokemon();
    }
        
    self.addPageEvents = function(){
       
        $(document).on('pagebeforeshow', '#detail-page', function(){
            onPokemonListPage = false;
            if(self.selectedPokemon.types == null || self.selectedPokemon.moves == null){
                self.requestSinglePokemon();
            }
            self.drawDetailView();
        });
       

       
        $(document).on('pagebeforeshow', '#index-page', function(){
            //alert("before indexPage show");
            onPokemonListPage = true;
        });
       
        $(document).on("scrollstop", function(){
            //Check if TriggerCell is on screen
            if(onPokemonListPage){
                var element = $('#'+triggerCell);
                if(self.isOnScreen(element)){
                    //alert("requesting new pokemon");
                    self.requestNewPokemon();
                    element.html('<img src="./img/pokeball_loading.gif" id="load-image"></img>');
                }
            }
        });
        
        $("#index-page").on("swiperight", function(){
            $.mobile.changePage('camera.html');
            onPokemonListPage = false;
            
        });
        
        $(document).on("pageinit", "#settings-page", function(){
            self.addSettingsEvents();
        });
        
        $(document).on("pageinit", "#camera-page", function(){
            self.addCameraEvents();
        });
    }
    
    self.addCameraEvents = function(){
        //swipe left
        $(document).on("swipeleft", "#camera-page", function(){
            onPokemonListPage = false;
            $.mobile.changePage('index.html');
        });
        
        //camera button
        $("#camera-button").on('tap', function(e){
            navigator.camera.getPicture( self.cameraSuccess, self.cameraError, {
                quality: 50, // Foto kwaliteit
                destinationType: Camera.DestinationType.DATA_URL // Base64 gecodeerde afbeelding als resultaat
            });
        });
    }
    
    self.battCrit = function(info){
        alert("batcrit called!");
        navigator.notification.alert("Your battery is SUPER low!");
        self.drawStatus(info);
    }
    
    self.battLow = function(info){
        alert("batlow called!");
        navigator.notification.alert("Your battery is low!");
        self.drawStatus(info);
    }
    
    self.cameraSuccess = function(imageData){
        $('#image').html('<img style="width: 100%;" src="' + "data:image/jpeg;base64," + imageData + '">');
    }
        
    self.cameraError = function(message){
        //alert("Something went wrong" + message);
    }
    
    self.battStat = function(info){
        self.drawStatus(info);
    }
    
    self.drawStatus = function(info){
        $('#battery-status').html("Battery: "+info.level +"%");
    };
    
    self.addBatteryListeners = function(){
        window.addEventListener("batterycritical", self.battCrit, false);
        window.addEventListener("batterylow", self.battLow, false);
        window.addEventListener("batterystatus", self.battStat, false);
    }
    
    self.drawPokemonList = function(){
        //This will draw all pokemon
        number = 1;
        $('#pokemon-list').empty();
        
        //alert(allPokemon);
        if(allPokemon != undefined){
            for(xPokemon in allPokemon){
                $('#pokemon-list').append("<li id='"+allPokemon[xPokemon].name+"'><a href='#detail-page'>"+number + " - " + allPokemon[xPokemon].name+"</a></li>");
                number++;
            }
            $('#pokemon-list').append("<li id='load'>Load more</li>");
        }
        
        $('#pokemon-list').listview('refresh');
    }
    

    
    self.isOnScreen = function(element){
        var viewport = {};
        viewport.top = $(window).scrollTop();
        viewport.bottom = viewport.top + $(window).height();
        var bounds = {};
        bounds.top = element.offset().top;
        bounds.bottom = bounds.top + element.outerHeight();
        return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
    };
    
    self.bindEvents = function() {
        document.addEventListener('deviceready', self.onDeviceReady, false);
    }
    
    self.requestNewPokemon = function(){
        api.getMorePokemon(function(data){
            console.log(data);
            for(xPokemon in data){
                //for each pokemon in result, add to allPokemon
                allPokemon.push(new Pokemon(data[xPokemon]['name'], null, null));
            }
            
            self.drawPokemonList();
        });
    }
    
    self.drawDetailView = function(){
        //change pokemon name
        $('#pokemon-name').html(self.selectedPokemon.name);
        
        //clear lists
        $('#types').empty();
        $('#moves').empty();
        
        
        //console.log(self.selectedPokemon.types);
        if(self.selectedPokemon.types != null && self.selectedPokemon.moves != null){
            $('#loading-image').hide();
            //types
            $('#types').append("<li data-role='list-divider' data-theme='b'>Types</li>");
            for(xType in self.selectedPokemon.types){
                //$('#types').append("<li>"+ self.selectedPokemon.types[xType] +"</li>");
                $('#types').append('<li>'+self.getTypeImage(self.selectedPokemon.types[xType]) + '</li>');
                //alert(self.getTypeImage(self.selectedPokemon.types[xType]));
            }
            
            //moves
            $('#moves').append("<li data-role='list-divider' data-theme='b'>Moves</li>");
            for(xMove in self.selectedPokemon.moves){
                $('#moves').append("<li>"+ self.selectedPokemon.moves[xMove] +"</li>")
            }
            
            //refresh lists
            $('#types').listview('refresh');
            $('#moves').listview('refresh');
        } else {
            $('#loading-image').show();
        }
    }
    
    self.updateUsername = function(){
        if(localStorage.getItem("name") == undefined || localStorage.getItem("name") == null){
            $('#pokedex').html("Someone's pokedex");
        } else {
            $('#pokedex').html(localStorage.getItem("name") + "\'s pokedex");
        }
    }
    
    self.requestSinglePokemon = function(){
        api.getPokemonByName(self.selectedPokemon.name, function(data){
            for(xPokemon in allPokemon){
                if(data['name'] == allPokemon[xPokemon].name){
                    //found required pokemon
                    allPokemon[xPokemon].types = data['types'];
                    allPokemon[xPokemon].moves = data['moves'];
                }
            }
            self.drawDetailView();
        });
    }
    
    self.getNewPokemon = function(pokemonName){
        //var allPokemon = localStorage.getItem("pokemon");
        for(xPokemon in allPokemon){
            if(pokemonName == allPokemon[xPokemon].name){
                return allPokemon[xPokemon];
            }
        }
        //No pokemon found!
        return null;
    }
    
    self.addSettingsEvents = function(){
        $('#save-button').on('tap', function(e){
            e.preventDefault();
            var value = $("#username").val();
            
            if(value.length >= 5 && value.length <= 10){
                localStorage.setItem("name", value);
                self.updateUsername();
                //self.onPokemonListPage = true;
                $.mobile.changePage('index.html');
            } else {
                alert("you need to give a name between 5 and 10 characters");
            }
        });
    }
    
    self.addTapEventsToList = function(){
        $('#pokemon-list').on('tap', function(e){
            e.preventDefault();
            var id = e.target.parentElement.id;
            if(id != "load"){
                self.selectedPokemon = self.getNewPokemon(id);
                $.mobile.changePage('detail.html');
            }
        });
        
        $('#settings-button').on('tap', function(e){
            e.preventDefault();
            self.onPokemonListPage = false;
            $.mobile.changePage('settings.html');
        });
    }
    
    self.getTypeImage = function(typeName){
        var image = '<div id="pokemon-type"><div id="'+typeName+"-type";
        image += '"></div></div>';
        return image;
    }
    
    self.bindEvents();
    
}