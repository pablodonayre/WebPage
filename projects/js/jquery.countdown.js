/**
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */

(function($){
		
	// Creating the plugin
	$.fn.countdown = function(prop){
		
		var options = $.extend({
			callback	: function(){},
			timestamp	: 0
		},prop);
		
		var left, d, h, m, s, positions;

		// Initialize the plugin
		init(this, options);
		
		positions = this.find('.position');

		var test;
		var count = 0;
		
		(function tick(){
			console.log('funcion tick')
			
			//
			// Modificar aqui la FECHA Y HORA objetivo
			//
			
			var hora_objetivo = '2025-02-28T12:00:00';
			var target = luxon.DateTime.fromISO(hora_objetivo);
			var hora_actual = luxon.DateTime.now();

			var offset = 1; // 1 hora adicional a la hora objetivo
			var factor = 0;

			if(hora_actual.ts > target.ts){
				var diff_horas = hora_actual.diff(target, 'hours').toObject();
				factor = Math.trunc(diff_horas.hours) + 1;
			} 

			var diff = (target + factor * offset * 3600 * 1000) - hora_actual.ts;
			console.log('target', target)
			console.log('factor', factor)
			console.log('offset', offset)
			console.log('hora_actual', hora_actual)
			console.log('diff', diff)

			if(count == 0){
				if(diff < 1000){
					console.log('if')
					clearTimeout(test)
					count = 1;
					setTimeout(reload, diff);
				}
			}

			// Number of seconds in every time division
			var day_base = (diff / 1000) / (3600 * 24);
			var days	= Math.trunc(day_base);
			
			var hour_base = (day_base - days) * 24;
			var hours	= Math.trunc(hour_base);
			
			var min_base = (hour_base - hours) * 60;
			var minutes	= Math.trunc(min_base);

			var sec_base = (min_base - minutes) * 60
			var seconds = Math.trunc(sec_base);

			// Number of days left
			d = days;
			updateDuo(0, 1, d);
			
			// Number of hours left
			h = hours;
			updateDuo(2, 3, h);
			
			// Number of minutes left
			m = minutes;
			updateDuo(4, 5, m);
			
			// Number of seconds left
			s = seconds;
			updateDuo(6, 7, s);
			
			// Calling an optional user supplied callback
			options.callback(d, h, m, s);
			
			// Scheduling another call of this function in 1s
			test = setTimeout(tick, 1000);
		})();
		
		// This function updates two digit positions at once
		function updateDuo(minor,major,value){
			switchDigit(positions.eq(minor),Math.floor(value/10)%10);
			switchDigit(positions.eq(major),value%10);
		}

		function reload(){
			window.location.reload();
		}
		
		return this;
	};


	function init(elem, options){
		elem.addClass('countdownHolder');

		// Creating the markup inside the container
		$.each(['Days','Hours','Minutes','Seconds'],function(i){
			$('<span class="count'+this+'">').html(
				'<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>'
			).appendTo(elem);
			
			if(this!="Seconds"){
				elem.append('<span class="countDiv countDiv'+i+'"></span>');
			}
		});
        $('.countDays').appendTo('day');

	}

	// Creates an animated transition between the two numbers
	function switchDigit(position,number){
		
		var digit = position.find('.digit')
		
		if(digit.is(':animated')){
			return false;
		}
		
		if(position.data('digit') == number){
			// We are already showing this number
			return false;
		}
		
		position.data('digit', number);
		
		var replacement = $('<span>',{
			'class':'digit',
			css:{
				top:'-2.1em',
				opacity:0
			},
			html:number
		});
		
		// The .static class is added when the animation
		// completes. This makes it run smoother.
		
		digit
			.before(replacement)
			.removeClass('static')
			.animate({top:'2.5em',opacity:0},'fast',function(){
				digit.remove();
			})

		replacement
			.delay(100)
			.animate({top:0,opacity:1},'fast',function(){
				replacement.addClass('static');
			});
	}
})(jQuery);