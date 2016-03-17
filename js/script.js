// console.log('hello')
// console.log($)

// var keyCode = '5viu393p8f45mg6c1d3h8udx'

// Example URL: https://openapi.etsy.com/v2/listings/active?api_key={YOUR_API_KEY}

var etsyLogo = document.querySelector('.etsy-logo')

// ---------------------- MODELs --------------------------//

var EtsyModel = Backbone.Model.extend({
	//https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?

	_apiKey: '5viu393p8f45mg6c1d3h8udx',
	url:'https://openapi.etsy.com/v2/listings/active.js?' + this._apiKey + '&callback=?'
})

var EtsyDetailModel = Backbone.Model.extend({
	_apiKey: '5viu393p8f45mg6c1d3h8udx',

	_generateUrl: function(listing_id){
			this.url = 'https://openapi.etsy.com/v2/listings/' + listing_id + '.js?' + this._apiKey + '&callback=?'
	}
})


// ---------------------- VIEWS --------------------------//
var EtsyHomeView = Backbone.View.extend({
	el: ".active-items",

	initialize: function(someModel){
		this.model = someModel
		var boundRender = this._render.bind(this)
	 	this.model.on('sync',boundRender)
	 },

	 events: {
	 	"click img.listing-pic": "_changeToDetailHash",
	 	"keydown input"        : "_searchUserInput"
	 },

	 _searchUserInput: function(searchEvent){
	 	var searchInput = searchEvent.target.value
	 	if(searchEvent.keyCode === 13){
	 		window.location.hash = 'search/' + searchInput
	 	}
	 },

	 _changeToDetailHash: function(clickEvent){
	 	var imgNode = clickEvent.target
	 	console.log(imgNode)
	 	window.location.hash = "details/" + imgNode.getAttribute("imgId")
	 },

	_render: function(){
		console.log(this.model)
		var htmlstr = '<input id="homeSearchbox" type="searchbox" placeholder="Search for items or shops">'
		var resultsArr  =  this.model.get('results')

		  for(var i=0; i < resultsArr.length; i++){
		 	 var resObj = resultsArr[i]
		 	 var images = resObj.Images[0].url_170x135
		 	 
		 	 htmlstr += '<div class ="single-listing">' 
		 	 htmlstr += '<img imgId ="' + resObj.Images[0].listing_id + '"class="listing-pic" src="' + images + '">'
		 	 htmlstr += '<p class ="list-title">' + resObj.title + '</p>'
		 	 htmlstr += '<p class = "list-price">' + '$' + resObj.price + '</p>'
		 	 htmlstr += '<p>' + resObj.Shop.shop_name + '</p>'
		 	 htmlstr += '</div>'
		 }
		 	this.el.innerHTML = htmlstr
	}
})

var EtsyDetailView = Backbone.View.extend({
	el: ".active-items",

	initialize: function(someModel){
		this.model = someModel
		var boundRender = this._render.bind(this)
		this.model.on('sync', boundRender)
	},

	_render: function(){
		console.log(this.model)
		var htmlstr = '<input>'
		var detailsObj = this.model.get('results')[0]
		var images = detailsObj.Images[0].url_570xN

			htmlstr += '<div class = "detailed-listing">'
			htmlstr += '<h1>' + detailsObj.title + '</h1>'
			// htmlstr += '<div class = "magnify"'
			htmlstr += '<img src="' + images + '">'
			// htmlstr += '</div>'
			htmlstr += '<p id="description">' + detailsObj.description + '</p>'
			htmlstr += '</div>'

			this.el.innerHTML = htmlstr

		}
})

var EtsyTitleView = Backbone.View.extend({
	el: " .listing-title",

	_viewName: null,

	initialize: function(string){
		this._viewName = string
	},

	_render: function(){
		var htmlstr = '<h2>' + this._viewName + '</h2>'	
		this.el.innerHTML = htmlstr
	}
		
})


// ---------------------- ROUTER --------------------------//

var EtsyRouter = Backbone.Router.extend({
	routes:{
		"home"                : "handleHomepage",
		"details/:listing_id" : "handleDetails",
		"search/:userInput"	  : "handleSearchInput",
		"*default"            : "handleHomepage"
	},

	handleHomepage: function(jsonData){
		var mod     = new EtsyModel()
		var newView = new EtsyHomeView(mod)
		var titView = new EtsyTitleView('Active Listing')
		titView._render()
		mod.fetch({
			data:{
				dataType: 'JSONP',
				api_key: mod._apiKey,
				includes:'Images,Shop'
			}
		})
	},

	handleDetails: function(id){
		var detailMod = new EtsyDetailModel ()
		detailMod._generateUrl(id)
		var newDetailView = new EtsyDetailView(detailMod)
		var titView = new EtsyTitleView('')
		titView._render()

		detailMod.fetch({
			data:{
				// dataType: 'JSONP',
				fields: 'listing_id,description,title',
				includes: 'Images,Shop',
				api_key: detailMod._apiKey
			}
		})
	},

	handleSearchInput: function(userInput){
		var sm = new EtsyModel()
		var sv = new EtsyHomeView(sm)

		sm.fetch({
			data:{
				api_key: sm._apiKey,
				keywords: userInput,
				includes: 'Images,Shop'

			}
		})
	},

	initialize: function(){
		Backbone.history.start()
	}
})

var rtr = new EtsyRouter()