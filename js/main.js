(function(exports){
	var Landscapes = {};

	// LANDSCAPES

	Landscapes.Application = function(options){
		this.options = options;

		this.scenes = [];
		this.$el = $(this.options.el);
		this.currentScene = null;

		this.introPopcorn = new Popcorn("#intro");

		this.clickPopcorn = new Popcorn("#camera-click");


		

		this.init();

	};

	Landscapes.Application.prototype.init = function() {
		var _this = this;

		this.createScenes();
		this.initEventHandlers();

		this.introPopcorn.play();

		this.introPopcorn.on("ended", function(){
			_this.selectScene(0);
			_this.$el.children("nav, .menu").fadeIn(400);
		})

		$(window).resize();
	};

	Landscapes.Application.prototype.createScenes = function(){
		var _this = this;
		this.$el.find(".scene").each(function(i, el){
			var scene = new Landscapes.Scene({el: el, index: i});

			_this.scenes.push(scene);
		});
	};

	Landscapes.Application.prototype.initEventHandlers = function() {
		var _this = this;

		this.$el.find("nav a").on("click", function(e){
			_this.onClickNav(e);
		});

		$(window).on("resize", function(){
			_this.onResize();
		})
	};

	Landscapes.Application.prototype.onClickNav = function(e) {
		e.preventDefault();

		var index = $(e.currentTarget).data("scene");
		this.selectScene(index);
	};

	Landscapes.Application.prototype.selectScene = function(index) {
		var _this = this;
		var targetScene = this.scenes[index];

		this.introPopcorn.pause();
		this.$el.find(".intro").addClass("hide");

		if(targetScene != this.currentScene){
			if(this.currentScene){
				this.currentScene.hide();
			}

			this.$el.children("nav").find("selected").removeClass("selected");

			this.$el.find("nav [data-scene='"+index+"']").addClass("selected");

			this.currentScene = targetScene;

			this.currentScene.show();

			setTimeout(function(){
				_this.clickPopcorn.play();
			}, 100);			
		}


	};

	Landscapes.Application.prototype.onResize = function() {
		var $window = $(window);
		var width = $window.width();
		var height = $window.height();

		var scale = width / this.scenes[0].$el.find(".background").width();


		log(width, height);
		log(scale)


		this.$el.find(".scene .content").css("transform", "scale("+scale+")");
	};


	// SCENE

	Landscapes.Scene = function(options){
		this.options = options
		this.$el = $(this.options.el);
		this.index = this.options.index;

		this.characters = {};
		this.currentCharacter = null;
		this.backgroundPopcorn = new Popcorn("#background");

		this.init();
	};

	Landscapes.Scene.prototype.init = function(){
		this.createCharacters();
		this.initEventHandlers();
	}

	Landscapes.Scene.prototype.initEventHandlers = function() {
		var _this = this;

		this.$el.find(".characters a, nav li a").on("click", function(e){
			_this.onClickCharacter(e);
		})
	};

	Landscapes.Scene.prototype.createCharacters = function() {
		var _this = this;

		this.$el.find(".characters li").each(function(i, el){
			var character = new Landscapes.Character({el: el});

			_this.characters[character.id] = character;
		});
	};

	Landscapes.Scene.prototype.onClickCharacter = function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();

		var characterId = $(e.currentTarget).parents("li").data("character");

		this.selectCharacter(characterId);

	};

	Landscapes.Scene.prototype.show = function(){
		var _this = this;

		this.$el.removeClass("transition-out");

		setTimeout(function(){
			_this.$el.addClass("transition-in");
		}, 1);


		this.backgroundPopcorn.play();

	}

	Landscapes.Scene.prototype.hide = function(){
		this.$el.addClass("transition-out").removeClass("transition-in");

		for(var id in this.characters){
			this.characters[id].hide();
		}

		this.$el.removeClass("character-talking");

		this.backgroundPopcorn.pause();

	}

	Landscapes.Scene.prototype.selectCharacter = function(id) {
		var oldCharacter = this.currentCharacter;
		var targetCharacter = this.characters[id];

		this.$el.find("nav .selected").removeClass("selected");

		this.backgroundPopcorn.pause();

		this.$el.addClass("character-talking");

		if(this.currentCharacter){
			this.currentCharacter.hide();
			this.currentCharacter = null;
		}


		if(targetCharacter != oldCharacter){
			this.currentCharacter = targetCharacter;
			this.currentCharacter.show();
			this.$el.find("nav [data-character='"+this.currentCharacter.id+"']").addClass("selected");
		}
		else{
			this.backgroundPopcorn.play();
			this.$el.removeClass("character-talking");

		}


	};


	Landscapes.Character = function(options){
		this.options = options;
		this.$el = $(this.options.el);


		this.init();
	}

	Landscapes.Character.prototype.init = function() {
		this.audio = this.$el.find("audio").get(0);


		this.popcorn = Popcorn("#"+$(this.audio).attr("id"));
		this.id = this.$el.data("character");
		
	};

	Landscapes.Character.prototype.show = function() {
		this.popcorn.play();
		this.$el.addClass("highlight");
	};

	Landscapes.Character.prototype.hide = function() {
		this.popcorn.pause();
		this.$el.removeClass("highlight");
	};






	exports.Landscapes = Landscapes;
})(window);

// create new Application instance

$(window).load(function(){
	new Landscapes.Application({el: "#scenes-container"});
})