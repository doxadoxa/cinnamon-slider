# Cinnamon slider
Touch friendly slider. Simple, small and fast.

## Dependencies
Cinnamon use jQuery. It's required.

## Files
- cinnamon.min.js - minified slider script 
- cinnamon.min.css - minified base css, required
- cinnamon.custom.css - additional scripts for start with slider

## How to use

HTML:
```html
<div class="cinnamon">
	<div class="cinnamon-item">
		...
	</div>
	<div class="cinnamon-item">
		...
	</div>
	<div class="cinnamon-item">
		...
	</div>
</div>

```

JS + jQuery

```javascript
$(".cinnamon").Cinnamon();

```

You can place in slides everything you need. Slides can have different width.

## Settings
Cinnamon can optional take settings object as parameter.

```javascript
$('.cinnamon').Cinnamon({
	// Transition time, ms
	speed : 500,

	// Show dots after slider (style example in cinnamon.custom.min.css)
	dots : true,

	// This class add to rendering dots
	dotsClass '.cinnamon-dots',
	
	// Ability to move the slider over the edge image
	offsetDrag : true,
	
	// Multiplier to change offsetDrag sensitivity
	offsetSlow : 1,

	// It defines the value of the pixel, which when moving the mouse will trigger the slide switch.
	sensitivity : 100,

	// Hash navigation turning
	hashNav : false,

	// Alignment of slides position. Works when slides width less then container width.
	alignment : 'left',

	// Class for stage (append from JS)
	'stage' : '.cinnamon-stage',

	// Class for slide/item
	'item' : '.cinnamon-item',

	// Events
	// On slider end initialize
	'onInitialize' : undefined,

	// On start slide change. Pass current slide in jQuery represent. 
	'onSlideChange' : undefined,

	// On slide changed. Pass current slide in jQuery represent.
	'onSlideChanged' : undefined,

	// On start slide translating. Pass current slide num and $slider obj (???)
	'onTranslating' : undefined,

	// On end start translated. Pass current $slider obj (???)
	'onTranslated' : undefined,

	// On touchmove slides. Pass current $slider object, x difference of mousemove, y difference of mousemove 
	'onTouchmove' : undefined
});
```