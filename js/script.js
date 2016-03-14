// console.log('hello')
// console.log($)

var keyCode = '5viu393p8f45mg6c1d3h8udx'

// Example URL: https://openapi.etsy.com/v2/listings/active?api_key={YOUR_API_KEY}


// ---------------------- MODEL --------------------------//

var EtsyModel = Backbone.Model.extend({
	//https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?

	_apiKey: keyCode,
		url:'https://openapi.etsy.com/v2/listings/active.js?api_key=5viu393p8f45mg6c1d3h8udx&callback=?'
	
})

// ---------------------- VIEWS --------------------------//
var EtsyHomeView = Backbone.View.extend({
	el: ".active-items",

	initialize: function(someModel){
		this.model = someModel
		var boundRender = this._render.bind(this)
	 	this.model.on('sync',boundRender)
	 },

	_render: function(){
		console.log(this.model)
		var htmlstr = ''
		var resultsArr  =  this.model.get('results')

		  for(var i=0; i < resultsArr.length; i++){
		 	 var resObj = resultsArr[i]
		 	 var images = resObj.Images[0].url_170x135
		 	 htmlstr += '<div class ="single-listing">' 
		 	 htmlstr += '<img class="listing-pic" src="' + images + '">'
		 	 htmlstr += '<p class ="list-title">' + resObj.title + '</p>'
		 	 htmlstr += '<p class = "list-price">' + '$' + resObj.price + '</p>'
		 	 htmlstr += '<p>' + resObj.shop_section_id + '</p>'
		 	 htmlstr += '</div>'
		 }
		 	this.el.innerHTML = htmlstr
	}
})



// ---------------------- ROUTER --------------------------//

var EtsyRouter = Backbone.Router.extend({
	routes:{
		"home"        : "handleHomepage",
		"details/:id" : "handleDetails"
	},

	handleHomepage: function(jsonData){
		var mod     = new EtsyModel()
		var newView = new EtsyHomeView(mod)
		mod.fetch({
			data:{
				includes:'Images' 
				// shop:'shop_name'
			}
		})

	},

	handleDetails: function(){

	},

	initialize: function(){
		Backbone.history.start()
	}
})

var rtr = new EtsyRouter()