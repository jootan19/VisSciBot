var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);

function SearchAndRT(succeed,fail){

var usrdata = { 
    screen_name: 'VisionSciBot',
    count: 1
    };

var sinceID = 0;

T.get('statuses/user_timeline',usrdata, function(err,data) {
    if(!err){    
      
      // --- GET ID OF LAST TWEET TO START SEARCHING FROM 
      sinceID = data[0].id_str;
      
      // --- SET UP SEARCH FOR NEW JOB POSTINGS
      var params_jobs = { 
        q: '#visionscientjobs',
        count: 100,
        result_type: 'recent',
        since_id: sinceID,
        lang: 'en'};
        
        T.get('search/tweets', params_jobs, function(err, data, response) {
                if(!err){
                  for(let i = 0; i < data.statuses.length; i++){
                  if(data.statuses[i].in_reply_to_status_id === null ){
                    // -- GET TWEET 
                    var tweet = String(data.statuses[i].text);
                    // -- IGNORE RT-ed TWEETS
                    if (tweet.substring(0,2) != 'RT') {
                      
                      // -- GET USERNAME OF TWEET-ER
                      var username = String(data.statuses[i].user.screen_name);
                      
                      // -- CREATING BODY OF TWEET
                      var retweetbody = 'RT @' + username + ' | Vision Science Jobs: twitter.com/anyuser/statuses/' + data.statuses[i].id_str;
                      //console.log(retweetbody);
                      console.log(data.statuses[i].text);
                      
                      // RETWEET
                      T.post('statuses/update',{status:retweetbody},function(err,data){console.log(data.text)});
                      
                      // FAVOURITE POST
                      T.post('favorites/create', {id: data.statuses[i].id_str}, function(err, response){});
                    }}}
                }else{
                  fail(err);
                }
              });
              
    
      // --- SET UP SEARCH FOR NEW TWEETS with #visionscience
      var params_news = { 
        q: '#visionscience',
        count: 100,
        result_type: 'recent',
        since_id: sinceID,
        lang: 'en'};
        
        T.get('search/tweets', params_news, function(err, data, response) {
                if(!err){
                  for(let i = 0; i < data.statuses.length; i++){
                  if(data.statuses[i].in_reply_to_status_id === null  ){
                    var tweet = String(data.statuses[i].text);
                    if (tweet.substring(0,2) != 'RT') {
                      var username = String(data.statuses[i].user.screen_name);
                      var retweetbody = 'RT @' + username + ' | Vision Science Tweets: twitter.com/anyuser/statuses/' + data.statuses[i].id_str;
                      //console.log(retweetbody);
                      console.log(data.statuses[i].text);
                      T.post('statuses/update',{status:retweetbody},function(err,data){console.log(data.text)});
                      T.post('favorites/create', {id: data.statuses[i].id_str}, function(err, response){});
                    }}}
                }else{
                  fail(err);
                }
              });
              

      // --- SET UP SEARCH FOR NEW TWEETS with terms matching "vision science""
      var params_news2 = { 
        q: '"vision science"',
        count: 100,
        result_type: 'recent',
        since_id: sinceID,
        lang: 'en'};
        
        T.get('search/tweets', params_news2, function(err, data, response) {
                if(!err){
                  for(let i = 0; i < data.statuses.length; i++){
                  if(data.statuses[i].in_reply_to_status_id === null  ){
                    var tweet = String(data.statuses[i].text);
                    if (tweet.substring(0,2) != 'RT') {
                      var username = String(data.statuses[i].user.screen_name);
                      var retweetbody = 'RT @' + username + ' | Vision Science Tweets: twitter.com/anyuser/statuses/' + data.statuses[i].id_str;
                      //console.log(retweetbody);
                      console.log(data.statuses[i].text);
                      T.post('statuses/update',{status:retweetbody},function(err,data){console.log(data.text)});
                      T.post('favorites/create', {id: data.statuses[i].id_str}, function(err, response){});
                    }}}
                }else{
                  fail(err);
                }
              });
    }else{
      fail(err);
    }
    succeed("success");
});
}



SearchAndRT(console.log, console.log);
