var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var HashMap = require('hashmap');
var startUrl = "https://www.flipkart.com/";
var depth= 1; //mention the depth value here
var depthCounter = 0;
var counter = 0;
var url = new URL(startUrl);
var baseUrl = url.protocol+ "//" + url.hostname;
var pages = new HashMap();
pages.set(startUrl,0); 
var counter = 0;

// A function to collect all the links on the page
function collectLinks($, value) {
  
  depthCounter = value+1;
  console.log("You are at level "+ value);

  var relativeLinks = $("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  relativeLinks.each(function() {
    if(pages.get(baseUrl + $(this).attr('href'))== null) //if the link doesn't exist in the map, push it.
      pages.set(baseUrl + $(this).attr('href'), depthCounter);
      });

  absoluteLinks = $("a[href^='h']");
  console.log("Found " + absoluteLinks.length + " absolute links on page \n");
     $(absoluteLinks).each(function(i, link){
      if(pages.get($(link).attr('href')) == null)
        pages.set($(link).attr('href'), depthCounter);
    });
}


function crawl() {

  var keys = pages.keys();
  var nextPage = keys[0];
  var value = pages.get(nextPage);

  //end the recursion if depth value of the url is greater than required
  if(value > depth)
  {
    console.log("Successfully crawled "+counter+" urls");      
    return;
  }
  //remove the page once it is visited
  pages.remove(nextPage);

  var end = Date.now() + Math.floor(Math.random()*10000);
  console.log("Waiting!");
  while (Date.now() < end) ;

  // Make the request
  console.log("Visiting page " + nextPage);
  counter++;

  request(nextPage, function(error, response, body) {
     // Check status code (200 is HTTP OK)
     try{console.log("Status code: " + response.statusCode);

     if(response.statusCode !== 200) {
       console.log("Oops! we are moving onto next url.");
     }
   }
   catch(e){
    console.log("invalid URL");
  }
     // Parse the document body
     var $ = cheerio.load(body);

     collectLinks($,value);
     crawl();

   });

}

//call to the main crawl function
crawl();
