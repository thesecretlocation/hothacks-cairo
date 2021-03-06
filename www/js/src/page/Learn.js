/*////////////////////////////////////////////////////////////////////////////////
// LEARN PAGE
////////////////////////////////////////////////////////////////////////////////*/

var Learn = Page.extend({
	locked:false,
	soundArr:null,
	noInstructions:false,
	
	// init function fires automatically from PageCore on document ready
	init:function(){
		//this.loadURL = "data/app/home.ajax.php";
		
		this.initSound();
		
		// call super to load
		arguments.callee.$.init.call(this); 
	},
	
	// called after load is complete
	buildObjects:function(){
		arguments.callee.$.buildObjects.call(this); 
		
		// adjust position of items that don't start at 0
		$(".parallax-layer-img").each(function(){
			var xpos = Number($(this).attr("xpos"));
			if (xpos) $(this).css("left", xpos);
			
			var ypos = Number($(this).attr("ypos"));
			if (ypos) $(this).css("top", ypos);
		});
	},
	
	// called after build is complete
	buildHandlers:function(){
		arguments.callee.$.buildHandlers.call(this); 
		var _this = this;
		
		// window scroll handler
		_this.scrollWin(0);
		$(window).scroll(function(){
			_this.scrollWin(0.5);
		});
		
		$(".parallax-cta img").click(function(){
			var page = $(this).parent().attr("page");
			_this.showPageContent(page);
		});
	},
	
	// called after buildHandlers is complete
	start:function(){
		arguments.callee.$.start.call(this); // call super to load
	},
	
	// Window Scroll Handler
	scrollWin:function(_ease){
		if (this.locked) return;
		var _this = this;
		
		// get window scroll
		var scrollTop = $(window).scrollTop();
		
		// scroll background
		$(".parallax-layer").each(function(){
			var val = Number($(this).attr("pval"));
			TweenLite.to($(this), _ease, {css:{"background-position-x":(scrollTop*val*0.1)}});
		});
		$(".parallax-layer-img").each(function(){
			var val = Number($(this).attr("pval"));
			TweenLite.to($(this), _ease, {css:{marginLeft:-(scrollTop*val)}, ease:Quad.easeOut});
		});
		
		var color1 = color2 = "#000000";
		var scrollWidth = 5000;
		var percent = scrollTop/10000;
		if (scrollTop<scrollWidth){
			color1 = this.interpolateColor("#ffc681", "#644c23", scrollWidth, scrollTop);
			color2 = this.interpolateColor("#e4edef", "#2f3128", scrollWidth, scrollTop);
		}else{
			percent = 1-percent;
			color1 = this.interpolateColor("#644c23", "#ffc681", scrollWidth, scrollTop-scrollWidth);
			color2 = this.interpolateColor("#2f3128", "#e4edef", scrollWidth, scrollTop-scrollWidth);
		}
		percent = percent*2;
		percent = Math.round((1-percent+0.1)*100)/100;
		
		// this only works for chrome (you will need to create gradient codes for all other browsers)
		var gradcolor = "-webkit-radial-gradient(center, ellipse cover, "+color1+" 0%,"+color2+" 100%)"; // radial gradient
		//var gradcolor = "-webkit-linear-gradient(left, "+color1+" 0%,"+color2+" 100%)"; // linear gradient
		TweenLite.to("#parallax-bg", 0, {css:{"background":gradcolor}});
		
		// opacity of back layer
		TweenLite.to("#layer-back", 0, {css:{"opacity":percent}});
		
		this.playSpecificSound();
		
		if (scrollTop!=0 && this.noInstructions==false){
			this.noInstructions=true;
			setTimeout(function(){
				$(".instructions").fadeOut();
			}, 1000);
		}
	},
	
	// called on page resize
	resize:function(){
		arguments.callee.$.resize.call(this); // call super to load
	},
	
	// interpolate between 2 colors
	interpolateColor:function(minColor, maxColor, maxDepth, depth){
		function d2h(d) {return d.toString(16);}
		function h2d(h) {return parseInt(h,16);}
	 
		if(depth == 0){
			return minColor;
		}
		if(depth == maxDepth){
			return maxColor;
		}
	 
		var color = "#";
	 
		for(var i=1; i <= 6; i+=2){
			var minVal = new Number(h2d(minColor.substr(i,2)));
			var maxVal = new Number(h2d(maxColor.substr(i,2)));
			var nVal = minVal + (maxVal-minVal) * (depth/maxDepth);
			var val = d2h(Math.floor(nVal));
			while(val.length < 2){
				val = "0"+val;
			}
			color += val;
		}
		
		return color;
	},
	
	showPageContent:function(_page){
		var _this = this;
		console.log("PAGE", _page);
		this.locked = true;
		
		$("html").addClass("locked");
		$(".parallax-layer, .parallax-layer-img").each(function(){
			var val = Number($(this).attr("pval"));
			TweenLite.to($(this), 0.75, {css:{bottom:470*val}, ease:Quint.easeOut});
		});
		
		$(".parallax-cta").hide();
		
		$("#page"+_page).show();
		
		TweenLite.to("#content-container", 0.75, {css:{bottom:0}, ease:Quint.easeOut, onComplete:function(){
			$("#parallax-container").click(function(){
				_this.closePageContent();
			});
			$("#parallax-container").css("cursor", "pointer");
		}});
		
		$(".instructions").hide();
	},
	
	closePageContent:function(_page){
		var _this = this;
		
		$(".parallax-layer, .parallax-layer-img").each(function(){
			var val = Number($(this).attr("pval"));
			TweenLite.to($(this), 0.75, {css:{bottom:0}, ease:Quint.easeOut});
		});
		
		TweenLite.to("#content-container", 0.75, {css:{bottom:-470}, ease:Quint.easeOut, onComplete:function(){
			$("html").removeClass("locked");
			_this.locked = false;
			$(".parallax-cta").show();
			$(".parallax-cta").css("opacity", 0);
			TweenLite.to(".parallax-cta", 0.25, {css:{opacity:1}});
			$(".content-page").hide();
		}});
		$("#parallax-container").off("click");
		$("#parallax-container").css("cursor", "auto");
	},
	
	initSound:function(){
		var assetsPath = Global.path+"asset/sound/learn/";
		this.soundArr = [];
		$("#content").append('<div id = "audioHolder"></div>');
		var audioItem = "";
		for (var i = 0; i < 5; i ++){
			audioItem+='<audio id ="audio'+i+'">';
			audioItem+='<source src="'+assetsPath+'sound'+i+'.mp3" type="audio/mpeg">';
			audioItem+='<source src="'+assetsPath+'sound'+i+'.ogg" type="audio/ogg">';
			audioItem+='</audio>';
			$("#audioHolder").append(audioItem);
			this.soundArr.push($(("#audio"+i)).get(0));
			$(("#audio"+i)).get(0).play();
			$(("#audio"+i)).get(0).volume = 0;
		};
		
		this.playSpecificSound();
	},
	
	playSpecificSound:function(){
		if (!this.soundArr) return;
		
		//determine sound to play
		var scrollTop = $(window).scrollTop();
		var soundNum = Math.round(scrollTop/2000);
		
		console.log("PLAYING SOUND:", soundNum);
		
		for(var i = 0; i < this.soundArr.length;i++){
			if(i == soundNum){
				TweenLite.to(this.soundArr[i], 2,{overwrite:true, volume:1});
			} else {
				TweenLite.to(this.soundArr[i], 2,{overwrite:true, volume:0});
			}
		}
	}
});

// initialize the page
Global.page = new Learn();
