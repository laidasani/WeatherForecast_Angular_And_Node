const express=require('express');
const request = require('request-promise');
const app=express();
const cors = require('cors')
var path = require('path');
//Enabling CORS
app.use(cors())

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, 'dist/angular-project')));

//Home URL
app.route('').get((req,res)=>{
	res.send()
});

//Geolocation API using street, city, state
app.route('/geolocation/street=:street&city=:city&state=:state').get((req,res)=>{
	var geocode_api_key="AIzaSyBERRcQ5RSrO3l4KgEKOW__y-Aw-h5t7K0";
	var streett=req.params['street']
	var cityy=req.params['city'];
	var statee=req.params['state'];
	var basic_url_geocode="https://maps.googleapis.com/maps/api/geocode/json?address=";
	var geocode_url=basic_url_geocode+streett+",+"+cityy+",+"+statee+"&key="+geocode_api_key; 

 	const options = {
  	method: 'GET',
  	url: geocode_url,
  	json: true
	}

	request(options)
  	.then(function (response) 
  	{
		  if(response.status==="ZERO_RESULTS")
		  {
			res.send({Error:"error"});	
		  }
		  else
		  {
			var temp=response.results[0].geometry.location;
			var lat=(temp.lat).toString();
			var lon=(temp.lng).toString();
			res.send({latitude:lat,longitude:lon});	
		  }
  			
	})
	.catch(function (err) {
		res.send("Error")
	})
});

//Dark Sky API using latitude, longitude
 app.route('/darksky/latitude=:lat&longitude=:lon').get((req,res)=>{

	var darksky_api_key="49d3a935108786a4ec4101d0ede43d30";
	var basic_url_darksky="https://api.forecast.io/forecast/";	
	var latitude=req.params['lat']
	var longitude=req.params['lon'];
	var darksky_url=basic_url_darksky+darksky_api_key+"/"+latitude+","+longitude;


 	const options_darksky = {
  	method: 'GET',
  	url: darksky_url,
  	json: true
	}


	request(options_darksky)
	.then(function (response) 
	{
		res.send(response)
 	 })
	  .catch(function (err) 
	  {
	  	res.send("Error")
  	})		
});

//Dark Sky API using latitude, longitude, time
app.route('/darkskymodal/latitude=:lat&longitude=:lon&time=:time').get((req,res)=>{

	var darksky_api_key="49d3a935108786a4ec4101d0ede43d30";
	var basic_url_darksky="https://api.forecast.io/forecast/";	
	var la=req.params['lat']
	var lo=req.params['lon'];
	var ti=req.params['time'];
	var darksky_url_modal=basic_url_darksky+darksky_api_key+"/"+la+","+lo+","+ti;

 	const options_darksky_modal = {
  	method: 'GET',
  	url: darksky_url_modal,
  	json: true
	}


	request(options_darksky_modal)
	.then(function (response) 
	{
		res.send(response)
 	 })
	  .catch(function (err) 
	  {
	  	res.send("Error")
  	})		
});


//Custom Google Search API using state
app.route('/imagesearch/state=:state').get((req,res)=>{
	var custom_search_url_start="https://www.googleapis.com/customsearch/v1?q=Seal%20of%20";
	var state=req.params['state'];
	var custom_search_url_end="&cx=017803431943558387609:4j3g6jpntyk&num=1&searchType=image&key=AIzaSyC3s89hQo-Z6an6HZbiU17LXX6xoLt4qb0";
	var custom_search_url=custom_search_url_start+state+custom_search_url_end; 


 	const custom_search_options = {
  	method: 'GET',
  	url: custom_search_url,
  	json: true
	}

	request(custom_search_options)
  	.then(function (response) 
  	{
		res.send(response.items[0])
	})
	.catch(function (err) {
		res.send("Error")
	})
});


//Autocomplete API
app.route('/autocomplete/input=:input').get((req,res)=>{
	var autocomplete_url_start="https://maps.googleapis.com/maps/api/place/autocomplete/json?input=";
	var input=req.params['input'];
	var autocomplete_url_end="&types=(cities)&language=en&key=AIzaSyBzGOyLCiDCGasxbaOwd2A9HS0RaUP6DNI";
	var autocomplete_url=autocomplete_url_start+input+autocomplete_url_end; 


 	const autocomplete_options = {
  	method: 'GET',
  	url: autocomplete_url,
  	json: true
	}

	request(autocomplete_options)
  	.then(function (response) 
  	{
		if(response.status==="ZERO_RESULTS")
		{
		  res.send({Error:"error"});	
		}
		else
		{
			res.send(response);
		}
		
	})
	.catch(function (err) {
		res.send("Error")
	})
});

//Custom Google Search API using state
app.route('/imagesearch2/city=:city').get((req,res)=>{
	var custom_search_url_start1="https://www.googleapis.com/customsearch/v1?q=";
	var city1=req.params['city'];
	var custom_search_url_end1="&cx=017803431943558387609:i9d9jhjiaut&num=8&searchType=image&key=AIzaSyC3s89hQo-Z6an6HZbiU17LXX6xoLt4qb0";
	var custom_search_url1=custom_search_url_start1+city1+custom_search_url_end1; 


 	const custom_search_options1 = {
  	method: 'GET',
  	url: custom_search_url1,
  	json: true
	}

	request(custom_search_options1)
  	.then(function (response) 
  	{
		res.send(response);
	})
	.catch(function (err) {
		res.send("Error")
	})
});




app.listen(8081,() =>
{
	console.log('Server started!')
});