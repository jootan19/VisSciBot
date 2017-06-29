var Twitter = require('twitter');
var config = require('./config_offline.js');
var T = new Twitter(config);

function noop(){}

function GetID(succeed,fail,sinceID){
  var usrdata = { 
    screen_name: 'VisionSciBot',
    count: 1
    };
    T.get('statuses/user_timeline',usrdata, function(err,data){
      if (!data.statuses) {
      fail(err);
    }
    sinceID(data[0].id_str);
  });
  succeed('success');
}

function SearchAndReTweet(passed,failed){
  GetID(noop,noop,function(sinceID){
     // --- SET UP SEARCH FOR NEW JOB POSTINGS
      var params_jobs = { 
        q: '"#visionsciencejobs" OR "visionscience" OR "Vision science" -filter:retweets',
        count: 100,
        result_type: 'recent',
        since_id:sinceID
        };
        
        T.get('search/tweets', params_jobs, function(err, data, response) {
                if(!err){
                  
                  for(let i = 0; i < data.statuses.length; i++){
                    // -- GET USERNAME OF TWEET-ER
                    var username = String(data.statuses[i].user.screen_name);
                    var tweeturl  = ': twitter.com/' + username + '/statuses/' + data.statuses[i].id_str;
                    
                    tweet = String(data.statuses[i].text).toLowerCase();
                    
                    // CONVERSATION THREADS ----------------------
                    if(data.statuses[i].in_reply_to_status_id !== null ){
                      
                      var retweetbody = 'Join a conversation with @' + username + ':' + tweeturl;
                      T.post('statuses/update',{status:retweetbody},function(err,data){console.log(data.text)});
                      console.log(retweetbody);
                      
                    // JOBS  ----------------------    
                    }else if(tweet.indexOf('#visionsciencejobs')>=0) { 
                      
                      var retweetbody = 'Looking for Vision Science Jobs? | RT @' + username + ':' + tweeturl;
                      T.post('statuses/update',{status:retweetbody},function(err,data){console.log(data.text)});
                      T.post('favorites/create', {id: data.statuses[i].id_str}, function(err, response){});
                      console.log(retweetbody);
                    
                    // EVERYTHING ELSE  ----------------------      
                    }else{
                      var retweetbody = 'Latest tweets | RT @' + username + ':' + tweeturl;
                      T.post('statuses/update',{status:retweetbody},function(err,data){console.log(data.text)});
                      T.post('favorites/create', {id: data.statuses[i].id_str}, function(err, response){});
                      console.log(retweetbody);
                    }
 
                  }
                }else{
                  failed(err);
                }
              });
              
  });
passed('done');
}

SearchAndReTweet(noop, noop);
