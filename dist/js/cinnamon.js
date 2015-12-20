(function($){

	$.fn.Cinnamon = function( options ) {

		var DEBUG = true;

		// Default settings for slider
		var settings = $.extend({
			'alignment' : 'left',
			'stage' : '.cinnamon-stage',
			'item' : '.cinnamon-item',
			//'autoSlide' : true,
			'speed' : 500,
			'offsetDrag' : true,
			'offsetSlow' : 1,
			'sensitivity' : 100,
			'hashNav' : true,

			//dots
			'dots' : true,
			'dotsClass' : ".cinnamon-dots"

			//callbacks
			//'onSlideChange' : function() {},
			//'onSlideChanged' : function() {}

		}, options);

		// stage and items jQuery elements
		var $stage = this.find( settings.stage );
		var $slider = this;

		if ( $stage.length == 0 ) {
			this.html('<div class="' + settings.stage.substring(1) + '">' + this.html() + '</div>');
			$stage = this.find( settings.stage );
		}

		var $items = this.find( settings.item );
		var slidesCount = $items.length;

		// Slides properties
		var slides = {
			width : [],
			offset : [],
			init : function() {
				// Init slides properties 
				slides.width = [];
				slides.offset = [ 0 ];

				$items.each( function( i, e ) {
					slides.width.push( $(e).width() );
				});

				for( var i = 0; i <= slides.width.length - 2; ++i ) {
					slides.offset.push( slides.width[i] + slides.offset[i] );
				}
			}
		}

		slides.init();

		$(window).on('resize', function() {
			slides.init();
		});
		
		// States
		var states = {
			animation : false
		}


		var methods = {
			slideChange : function( slideNum ) {
				var diff;

				settings.onTranslating && settings.onTranslating( slideNum, $slider );

				settings.onSlideChange && settings.onSlideChange( slideNum );

				if ( settings.alignment == 'left' ) {
					diff = slides.offset[slideNum];
				}

				if ( settings.alignment == 'right' ) {
					diff = slides.offset[slideNum] - ( $(window).width() - slides.width[slideNum] );
				}

				if ( settings.alignment == 'center' ) {
					diff = slides.offset[slideNum] - ( $(window).width() - slides.width[slideNum] )/2;
				}

				states.animation = true;

				currSlideNum = slideNum;

				$stage.css({
					'-webkit-transform'  : 'translate3d(' + ( - diff ) + 'px,0,0)',
					'-ms-transform' : 'translate3d(' + ( - diff ) + 'px,0,0)',
					'transform' : 'translate3d(' + ( - diff ) + 'px,0,0)',
					'transition' : settings.speed + 'ms'
				});

				if ( settings.dots ) {
					var $dots = $slider.next( settings.dotsClass ).find('li');
					$dots.removeClass('active');
					$( $dots[ slideNum ] ).addClass('active');
				}

				setTimeout( function() {
					states.animation = false;
					
					if ( settings.hashNav ) {
						var hashNav = $( $items[currSlideNum] ).data('hash-nav');

						if ( hashNav != undefined ) {
							location.hash = hashNav;
						}
					}

					settings.onTranslated && settings.onTranslated( $slider );
					settings.onSlideChanged && settings.onSlideChanged( $( $items[slideNum] ) );
				}, settings.speed/2)
				
			}
		};

		if ( settings.dots ) {
			this.after('<ul class="' + settings.dotsClass.substring(1) + '"></ul>');
			var dotsHtml = "";

			$items.each( function(i,e) {
				dotsHtml += "<li><span></span></li>";
			});

			$dotsContainer = this.next( settings.dotsClass );

			$dotsContainer.html( dotsHtml );

			$dotsContainer.find('li').each(function(i,e){
				$(this).attr("role", "button");

				if ( i == 0 ) {
					$(e).addClass('active');
				}

				$(this).on('click', function() {
					methods.slideChange( i );
					return false;
				});
			});
		}

		var currSlideNum = 0;

		$(window).on('resize', function() {
			methods.slideChange( currSlideNum );
		});

		$(this).data('Cinnamon', {
			slideTo : function( slideNum ) {
				methods.slideChange( slideNum );
			},
			next : function() {
				if ( currSlideNum < $items.length - 1 ) {
					methods.slideChange( ++currSlideNum );
				}
			},
			prev : function() {
				if ( currSlideNum > 0 ) {
					methods.slideChange( --currSlideNum );
				}
			}, 
			getCurrentPos : function() {
				return currSlideNum;
			},
			getSlidesCount : function() {
				return slidesCount;
			}
		});

		if ( settings.hashNav ) {
			if ( location.hash.length > 0 ) {
				$items.each( function(i,e) {
					if ( "#" + $(e).data('hash-nav') == location.hash ) {
						methods.slideChange( i );
					}
				})
			}
		}

		$stage.on('mousedown touchstart', function( ev ) {
			$(this).off('mouseup touchend');

			// Add active class to change cursor
			$(this).addClass('active');

			var currLeftOffset = $(this).offset().left

			if ( states.animation ) {
				return;			
			}

			var startX = ( ev.pageX || ev.originalEvent.changedTouches[0].pageX ) - currLeftOffset;
			var startY = ( ev.pageY || ev.originalEvent.changedTouches[0].pageY );

			$(this).on('mousemove touchmove', function( ev ) {
				var x = ev.pageX || ev.originalEvent.changedTouches[0].pageX;
				var y = ev.pageY || ev.originalEvent.changedTouches[0].pageY;
	
				var diff = startX - x;
				var diffY = startY - y;

				settings.onTouchmove && settings.onTouchmove( $slider, diff, diffY );

				if ( Math.abs(diff + currLeftOffset) < Math.abs(diffY) ) {
					$(this).off('mousemove touchmove');
				}

				var rightEnd = slides.offset[ slides.offset.length - 1 ];

				if ( settings.alignment == "right" ) {
					rightEnd -= ( $(window).width() - slides.width[ slides.width.length - 1 ] );
				}

				if ( settings.alignment == "center" ) {
					rightEnd -= ( $(window).width() - slides.width[ slides.width.length - 1 ] )/2;
				}

				if ( settings.offsetDrag ) {
					if ( diff < 0 ) {
						diff /= settings.offsetSlow;
					}

					if ( diff > rightEnd ) {
						diff = rightEnd + ( diff - rightEnd ) / settings.offsetSlow;
					}
				}

				if ( !settings.offsetDrag ) {
					if ( diff < 0 ) {
						diff = 0;
					}

					if ( diff > rightEnd ) {
						diff = rightEnd;
					}
				}

				$(this).css({
					'transform' : 'translate3d(' + ( - diff ) + 'px,0,0)',
					'-webkit-transform' : 'translate3d(' + ( - diff ) + 'px,0,0)',
					'-moz-transform' : 'translate3d(' + ( - diff ) + 'px,0,0)',
					'transition' : '0s'
				});

				if ( Math.abs(diff + currLeftOffset) > Math.abs(diffY) ) {
					return false;
				}
			});

			$(this).on('mouseup touchend', function( ev ) {
				var endX = ( ev.pageX || ev.originalEvent.changedTouches[0].pageX ) - currLeftOffset;

				if ( endX - startX > settings.sensitivity && currSlideNum > 0 ) {
					--currSlideNum;
				}

				if ( endX - startX < -settings.sensitivity && currSlideNum < $(this).find( settings.item ).length - 1 ) {
					++currSlideNum;
				}
				
				methods.slideChange( currSlideNum );

				$(this).removeClass('active');

				$(this).off('mousemove touchmove');
			});

		});
	}

})(jQuery);