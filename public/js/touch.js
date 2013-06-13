define(function() {

	return {
		hasTouch: true,
		init: function() {
			var topLayer = document.querySelector('.layer');
			var threshold = 100;
			var windowHeight = window.innerHeight;
			var touch = {};
			var visibleTabHeight = 30;

			top.addEventListener('touchstart', function(e) {
				touch.x = e.changedTouches[0].clientX;
				touch.y = e.changedTouches[0].clientY;
			});

			top.addEventListener('touchmove', function(e) {
				var y = e.changedTouches[0].clientY;
				if (y < touch.y) { // if the touch moved up
					topLayer.classList.add('no-trans'); // don't animate properties while moving touch
					topLayer.style.bottom = touch.y - y + 'px';
					e.preventDefault();
				}
			});

			top.addEventListener('touchend', function(e) {
				topLayer.classList.remove('no-trans');
				topLayer.style.bottom = (touch.y - e.changedTouches[0].clientY) > threshold ? windowHeight - visibleTabHeight + 'px' : 0;
				touch = {};
			});
		}
	};
});