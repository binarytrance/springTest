// "use strict";
// IIFE to keep things modular and nice
// need to make things more functional
// Declare function arguments - any computation inside a function depends only on the arguments, and not on any global object or variable.
(function() {

	// define constructor which is public
	this.SwypeSlider = function() {
		// create global references
		var arrow;
		this.arrowsinTouch = null;
		this.visibleSlides = null;
		this.slidesToSwype = null;
		this.slideOnScroll = null;
		this.slideOnMouseScroll = null;
		
		// console.log(this.arrowsArray, typeof this.arrowArray, Array.isArray(this.arrowsArray), this.arrowsArray instanceof Array, this.arrows);
		// this.arrowsArray.forEach(function(d, i) {
		// 	d.addEventListener("click", this.changeSlide());
		// 	console.log(i);
		// })
		
		
		// define default options
		var defaults = {
			arrowsinTouch: false,
			className: "swypeContainer",
			visibleSlides: 3,
			slidesToSwype: 1,
			slideOnScroll: false,
			slideOnMouseScroll: false
		}

		// check to see if user has provided options object
		if(arguments[0] && typeof arguments[0] === "object") {
			this.options = extendDefaults(defaults, arguments[0]);
		}
		console.log(this.options);
	}
	SwypeSlider.prototype.initSwype = () => {
		console.log(this.options);
		// console.log(this.arrows);
		this.temp = "temp";
		var temp = "tempVar";
		console.log(temp);
		this.slidesArray = document.getElementsByClassName("swypeSlide");
		this.swypeSliderWrapper = document.getElementsByClassName("swypeSlider-wrapper");
		// number of slides visible on screen at any given time
		this.visibleSlides = 3;
		// console.log(this.swypeSliderWrapper);
		// buildSlider
		buildSlider();
		// manageEvents
		manageEvents.handleSlideChange();
	}

	// private method that build the slider initially
	buildSlider = () => {
		console.log(temp)		
		// calculates the width of slides based on the number of slides that are to be visible
		this.slideWidth = Math.round((100 / this.visibleSlides) * 100) / 100;
		console.log(this.swypeSliderWrapper);
		Array.from(this.swypeSliderWrapper).forEach(function(item) {
			item.dataset.translate = 0;
		})
		// this.swypeSliderWrapper.dataset.icon = "0";	
		Array.from(this.slidesArray).forEach(function(item) {
			item.style.width = this.slideWidth + "%";
		});
	}

	// attach events to the slider
	// (PRIVATE OR PUBLIC object???)
	var manageEvents = {
		// event to handle arrow keys which change slides
		// method inside manageEvents (PRIVATE OR PUBLIC???)
		handleSlideChange() {
			this.arrowsArray = document.getElementsByClassName("js-round-arrow");
			this.arrows = this.arrowsArray; // correct
			console.log(this.arrows, "this.arrows");
			console.log(this.arrows, this.arrowsArray);
			// looping over a HTML collection
			for(var i = 0; i < this.arrows.length; i++) {
				console.log("adding event listener", this.arrows[i]);
				this.arrows[i].addEventListener("click", changeSlide.bind(this, event));
			}
		} 
	};

	//private method to change slides on clicking of arrow key
	changeSlide = () => {
		console.log(909, this, event.target);
		// slider initialisation
		var translateVal = 0;
		var maxTranslation = 0;
		console.log(this, this.className);
		if(hasClass(event.target, "round-arrow--right")) {
			console.log(true);
		}
		console.log(event.target, this, $(this));
		var slideNumber = event.target.parentNode.getElementsByClassName("swypeSlide").length;
		clicks = slideNumber - this.visibleSlides;
		maxTranslation = clicks * this.slideWidth;
		console.log(maxTranslation);
		var maxTranslationRounded = Math.round(maxTranslation * 100) / 100;
		console.log(window.innerWidth);
		// .siblings($(".swypeSlider-container")).children(".swypeSlider-wrapper").children(".swypeSlide").length;
		// console.log(event.target, event.target.parentNode.getElementsByClassName("swypeSlide").length);
		if(hasClass(event.target, "round-arrow--left") && window.innerWidth > 769) {
			console.log("left and >769");

			var attrVal = event.target.parentNode.getElementsByClassName("slider-parent")[0].getAttribute("data-translate");
			console.log(attrVal);
			var newAttrVal = parseFloat(attrVal) + this.slideWidth;
			translateVal = newAttrVal;
			var translateValRounded = Math.round(translateVal * 100) / 100;
			console.log(translateValRounded);
			// var attrVal = $(this).siblings(".slider-gran").children(".slider-parent").attr("data-translate");
			event.target.parentNode.getElementsByClassName("slider-parent")[0].setAttribute("data-translate", translateVal)

// $(this).siblings(".slider-gran").children(".slider-parent").attr("data-translate", translateVal);
		}
		else if(hasClass(event.target, "round-arrow--right") && window.innerWidth > 769) {
			console.log("right and <769");
			var attrVal = event.target.parentNode.getElementsByClassName("slider-parent")[0].getAttribute("data-translate");
			console.log(attrVal);
			var newAttrVal = parseFloat(attrVal)+ (-this.slideWidth);
			translateVal = newAttrVal;
			var translateValRounded = Math.round(translateVal * 100) / 100;
			console.log(translateValRounded);
			// var attrVal = $(this).siblings(".slider-gran").children(".slider-parent").attr("data-translate");
			event.target.parentNode.getElementsByClassName("slider-parent")[0].setAttribute("data-translate", translateVal)

		}
		if(translateValRounded === 0) {
			if(hasClass(event.target, "round-arrow--left")) {
				event.target.style.display = "none";
			}
		}
		else {
			event.target.parentNode.getElementsByClassName("round-arrow--left")[0].style.display = "flex";
			// $(this).siblings(".round-arrow--right").css("display", "flex");
		}

		if(translateValRounded <= -maxTranslationRounded) {
			if(hasClass(event.target, "round-arrow--right")) {
				event.target.style.display = "none";
			}
			// $(".round-arrow--right").css("display", "none");
		}
		else {
			event.target.parentNode.getElementsByClassName("round-arrow--right")[0].style.display = "flex";
		}
		
// $(this).siblings(".slider-gran").children(".slider-parent").attr("data-translate", translateVal);
		event.target.parentNode.getElementsByClassName("slider-parent")[0].style.transform = "translateX(" + translateVal + "%)";
		// $(this).hasClass("round-arrow--left") && $(window).width() > 769
	};
	// Private method to extend default options with user options
	function extendDefaults(source, userObject) {
		// check to see if arguments[0] has properties
		var property;
		for(property in userObject) {
			if(source.hasOwnProperty(property)) {
				source[property] = userObject[property];
			}
		}
		return source;
	}

	// hasClass function to see if the target element has the particular class or not
	function hasClass(element, className) {
		return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
	}

	$(window).on("load resize", function() {
		$(".slider-parent").attr("data-translate", 0);
		$(".slider-parent").css("transform", "translateX(0)")
		// controls visibility of navigation arrows
		if($(window).width() > 768) {
			$(".round-arrow--right").css("display", "flex");
			$(".round-arrow--left").css("display", "none");
		}
		else {
			$(".round-arrow--right").css("display", "none");
			$(".round-arrow--left").css("display", "none");
		}
		
	});
})();

// var initSlider = new SwypeSlider({
// 	arrowsinTouch: true,
// })

// slide on scroll functionality


// if($(window).width() > 1200) {
// 	console.log(">1024");
// 	$('.text-slider').slick(textObj).on("mousewheel", function(event) {
	
// 	  // console.log("testt");
// 	  // if($(window).width() > 1024) {
// 		  // console.log("testt1024");
// 		  event.preventDefault();
// 		  if (event.deltaX > 0 || event.deltaY < 0) {
// 				$(this).slick("slickNext");
// 			} else if (event.deltaX < 0 || event.deltaY > 0) {
// 				$(this).slick("slickPrev");
// 			}
// 	  // }
// 	});

// 	$('.image-slider').slick(imageObj).on("mousewheel", function(event) {
// 	  // console.log("scroll");
	  
// 	  // if($(window).width() > 1024)  {
// 		  // console.log("testt1024");
// 		  event.preventDefault();
// 		  if (event.deltaX > 0 || event.deltaY < 0) {
// 				$(this).slick("slickNext");
// 			} else if (event.deltaX < 0 || event.deltaY > 0) {
// 				$(this).slick("slickPrev");
// 			}
// 	  // }
// 	});
// }

