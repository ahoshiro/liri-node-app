require('dotenv').config()

var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var liriArgument = process.argv[2];
var fs = require("fs");

// Default instructions to operate the program. 
console.log("\r\n" +  "Welcome to LIRI. In order to use it, type in the following VALID commands following 'node liri.js' :"+"\r\n"+
"my-tweets 'any valid twitter account name' "+"\r\n"+
"spotify-this-song 'any music title'" + "\n\r" +
"movie-this 'any movie title'" + "\n\r" +
"do-what-it-says" + "\n\r"+
"If using more than one word, make sure it is placed with QUOTATION marks.");

if (liriArgument === "my-tweets"){
    myTweets();
} else if(liriArgument === "spotify-this-song"){
    spotifyThis();
} else if(liriArgument === "movie-this"){
    movieThis();
} else if(liriArgument === "do-what-it-says"){
    doThis();
};
// FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	function movieThis(){
		var movie = process.argv[3];
		if(!movie){
			movie = "Mr. Nobody";
		}
		params = movie
		request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
			if (!error && response.statusCode == 200) {
                console.log("-----------------------------------------------------------------" + "\r\n")
                console.log("Movie Title: "+ JSON.parse(body).Title);
                console.log("Movie Year: "+ JSON.parse(body).Year);
                console.log("IMDB rating: "+ JSON.parse(body).imdbRating);
                console.log("Movie Country: "+ JSON.parse(body).Country);
                console.log("Movie Language: "+ JSON.parse(body).Language);
                console.log("Movie Plot: "+ JSON.parse(body).Plot);
                console.log("Movie Actors: "+ JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: "+ JSON.parse(body).Ratings[0]);
                console.log("-----------------------------------------------------------------" + "\r\n")
                fs.appendFile('log.txt', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + response + '\r\n =============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                    if (err) throw err;
                });
				// log(movieResults); // calling log function
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
    };
    // ----------------------------------------------------------------------------------------------------------
	// Tweet function, uses the Twitter module to call the Twitter api
	function myTweets() {
        var twitterUsername = process.argv[3];
		if(!twitterUsername){
			twitterUsername = "@RealDonaldTrump";
		}
		params = {screen_name: twitterUsername};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
          if (!error) {
            if (!error && response.statusCode == 200) {
                fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n'), function(err) {
                    if (err) throw err;
                });
                console.log(' ');
                console.log('Last 20 Tweets:')
                for (i = 0; i < tweets.length; i++) {
                    var number = i + 1;
                    console.log(' ');
                    console.log([i + 1] + '. ' + tweets[i].text);
                    console.log('Created on: ' + tweets[i].created_at);
                    console.log(' ');
                    fs.appendFile('terminal.log', (number + '. Tweet: ' + tweets[i].text + '\r\nCreated at: ' + tweets[i].created_at + ' \r\n'), function(err) {
                        if (err) throw err;
                    });
                }
                fs.appendFile('terminal.log', ('=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                    if (err) throw err;
                });
            }
          }
        });
    }
    
    // ----------------------------------------------------------------------------------------------------------
	// Spotify function, uses the Spotify module to call the Spotify api
	function spotifyThis(songName) {
		var songName = process.argv[3];
		if(!songName){
			songName = "Halo";
		}
		params = songName;
		spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
                        log(spotifyResults); // calling log function
                        fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() +'\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n' + 'Artist: ' + jsonBody.tracks.items[0].artists[0].name + '\r\nSong: ' + jsonBody.tracks.items[0].name + '\r\nPreview Link: ' + jsonBody.tracks.items[0].preview_url + '\r\nAlbum: ' + jsonBody.tracks.items[0].album.name + '\r\n=============== LOG ENTRY END ===============\r\n \r\n'), 
                        function(err) {
                            if (err) throw err;
                        });
					}
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
		});
    };
    // ----------------------------------------------------------------------------------------------------------
	// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
	function doThis() {
        fs.readFile('random.txt', 'utf8', function(error, data) {
            if (error) {
                console.log(error);
            } else {
                var dataArr = data.split(',');
                if (dataArr[0] === 'spotify') {
                    spotifyThis(dataArr[1]);
                }
                if (dataArr[0] === 'omdb') {
                    movieThis(dataArr[1]);
                }
            }
        });
    } // end doWhatItSays function
