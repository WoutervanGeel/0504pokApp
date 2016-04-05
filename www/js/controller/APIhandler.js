function APIhandler(){
	var self = this;
	//var url = "https://obscure-plains-37886.herokuapp.com/";
    var url = "http://pokeapi.co/api/v2/"; //pokemon/?limit=40&offset=1
    
    // ALWAYS EVEN NUMBER
    var limit = 30;
    var offset = 0;
    
    var isLoading = false;
    
    self.getPokemonByName = function(id, callback){
        if(!isLoading){
            isLoading = true;
            $.get( url + "pokemon/"+id, function(data) {
                var types = [];
                console.log(data);
                for(xType in data['types']){
                    types.push(data['types'][xType].type.name);
                }
                console.log(types);
                
                var moves = [];
                for(xMove in data['moves']){
                    moves.push(data['moves'][xMove].move.name);
                    //alert("move: "+data['moves'][xMove]['name']);
                }
                //var pokemon = new Pokemon(data['name']);
                //alert(data['types'][0]['name']);
                var pokemon = new Pokemon(id, types, moves);
                isLoading = false;
                callback(pokemon);
            });
        }
	}
    
    self.getMorePokemon = function(callback){
        if(!isLoading){
            var pokemon = [];
            isLoading = true;
            
            $.get( url + "pokemon" + "?limit="+limit+"&offset="+offset, function(data) {
                console.log(data);
                console.log(data['results']);
                for(xResult in data['results']){
                    //alert(data['results'][xResult].name);
                    pokemon.push(new Pokemon(data['results'][xResult].name, null, null));
                }
                // data['results'].forEach(function(xResult) {
                //     pokemon.push(new Pokemon(xResult.name, null, null));
                // });
                
                offset += limit;
                isLoading = false;
                callback(pokemon);
            });
        }
    }
    
    
    // // Example! ----------------------------------------------------------------------------------------------------------------------------------------------------
    
	// self.getShips = function(callback){
	// 	boats = [];
	// 	$.get( url + "ships" + token, function(data) {
	// 		 for(i = 0; i < data.length; i++){
	// 		 	boats[i] = new Boat(data[i].length, false, data[i].name, data[i]._id);
	// 		 }
	// 		 callback(boats);
	// 	});
	// }

	// self.getGames = function(callback){
	// 	var comUrl = url + "users/me/games" + token;

	// 	$.ajax({
	// 	    type: "GET",
	// 	    url: comUrl,
	// 	    success: function(data,status,xhr){
	// 	        callback(data);
	// 	    },
	// 	    error: function(xhr, status, error){
	// 	        alert("Er is geen communicatie met de API mogelijk. Probeer het later nog eens.");
	// 	    },
	// 	});
	// }
	
	// self.getGame = function(gameId, callback){
	// 	$.get(url + "games/" + gameId + token, function(data){
	// 		callback(data);
	// 	});
	// }

	// self.newGame = function(callback){
	// 	$.get(url + "games" + token, function(data){
	// 		callback(data);
	// 	});
	// }

	// self.newComputerGame = function(callback){
	// 	$.get(url + "games/AI" + token, function(data){
	// 		callback(data);
	// 	});
	// }

	// self.clearGamelist = function(callback){
	// 	$.ajax({
	// 	 url: url + 'users/me/games' + token,
	// 	 type: 'DELETE', 
	// 	 success: function(result) { console.log(result)},
	// 	 fail: function(error){ console.log(error)}
	// 	}).done(callback);
	// }

	// self.submitBoard = function(game, callback){
	// 	$.post(url + "games/"+game._id+"/gameboards"+token, game.myGameboard, function(returnData){
	// 		callback(returnData);
	// 	});
	// }

	// self.shoot = function(game, cell, callback){
	// 	$.post(url + 'games/'+game._id + '/shots' + token, cell, function(returnData){
	// 		callback(returnData);
	// 	});
	// }
}
