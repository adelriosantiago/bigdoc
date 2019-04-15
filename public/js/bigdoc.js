// Generated by CoffeeScript 1.9.0
(function() {
	var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	$(function() {
		var background, bar, complete, connectorStr, fetcher, fill, filter_diseases, fontSize, generate, h, jsonOnly, keyword, layout, max, maxLength, relevantStr, scale, statusText, svg, vis, w, words, wordsMatch;
		fill = d3.scale.category20b();
		w = 800;
		h = 600;
		words = [];
		max = void 0;
		scale = 1;
		complete = 0;
		keyword = '';
		fontSize = void 0;
		maxLength = 100;
		fetcher = void 0;
		statusText = d3.select('#status');
		layout = d3.layout.cloud().timeInterval(10).size([w, h]).fontSize(function(t) {
			return fontSize(+t.value);
		}).text(function(t) {
			return t.key;
		}).on('word', progress).on('end', draw);
		svg = d3.select('#wordcloud').append('svg').attr('width', w).attr('height', h);
		background = svg.append('g');
		vis = svg.append('g').attr('transform', 'translate(' + [w >> 1, h >> 1] + ')');
		generate = function(wordsMatch) {
			layout.font(d3.select('#font').property('value')).spiral(d3.select('input[name=spiral]:checked').property('value'));
			fontSize = d3.scale[d3.select('input[name=scale]:checked').property('value')]().range([10, 50]);
			wordsMatch.length && fontSize.domain([+wordsMatch[wordsMatch.length - 1].value || 1, +wordsMatch[0].value]);
			complete = 0;
			words = [];
			layout.stop().words(wordsMatch.slice(0, max = Math.min(wordsMatch.length, +d3.select('#max').property('value')))).start();
		};
		function draw(t, e) {
		scale = e ? Math.min(w / Math.abs(e[1].x - w / 2), w / Math.abs(e[0].x - w / 2), h / Math.abs(e[1].y - h / 2), h / Math.abs(e[0].y - h / 2)) / 2 : 1;
		words = t;
		var n = vis.selectAll("text").data(words, function(t) {
			return t.text.toLowerCase()
		});
		
		//Draw the new words
		n.transition().duration(1e3).attr("transform", function(t) {
			return "translate(" + [t.x, t.y] + ")rotate(" + t.rotate + ")"
		}).style("font-size", function(t) {
			return t.size + "px"
		}), n.enter().append("text").attr("text-anchor", "middle").attr("transform", function(t) {
			return "translate(" + [t.x, t.y] + ")rotate(" + t.rotate + ")"
		}).style("font-size", "1px").transition().duration(3e3).style("font-size", function(t) {
			return t.size + "px"
		}), n.style("font-family", function(t) {
			return t.font
		}).style("fill", function(t) {
			return fill(t.text.toLowerCase())
			//return "red"; //This would make all words red initially
		}).text(function(t) {
			return t.text
		});
		
		var a = background.append("g").attr("transform", vis.attr("transform")),
			r = a.node();
			
		n.exit().each(function() {
			r.appendChild(this)
		})
		
		a.transition().duration(4e3).style("opacity", 1e-6).remove(), //Clear the old words
		//a.transition().duration(5e3).style("font-size", "1px"); //Why is this not working!?
		
		//Slowly zoom to the results
		vis.transition().duration(3e3).attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")")
			.each("end", _.once(function() {
				//TODO: Remove top coloring
				n.transition().duration(1500).style("fill", function(t) {
					//return fill(t.text.toLowerCase()) //This would make all words randomly colorful
					if (t.size > 45) {
						return "rgb(" + t.size * 5 + ", 0, 0)";
					} else {
						return "rgb(" + (255 - (t.size * 5)) + ", " + (255 - (t.size * 5)) + ", 255)";
					}
				})
			}));
	}
	
	function progress() {
		bar.set(++complete / max);
	};
		/*
			#TODO: Implement word quantity by slider
			$('#cloudCount').slider {
				formatter : (value) ->
					return "abc: " + value
				}
		*/

		/*
			exampleDiseases = 
				cold : "I cough often and have runny, stuffy nose. My throat is sore and congested. I've been sneezing a lot recently and I feel fatigued even when doing usual tasks like going upstairs.",
				#pneumonia : "I am 60 years old. My main symptom is fever and cough and green mucus sometimes tinged with a bit of blood. My heartbeat is faster than usual and feel more tired and weak than usual.", #No longer used as it its symptoms are too difficult to notice...
				diabetes : "I constanly feel thirsty, like if I couldn't quench my thirst. By this reason I'm going to the bathroom very often, I go pee like 12 or 15 times a day when I would usually go like 4 times as much. Also, waking up and going to pee in the middle of the night is becoming really usual and annoying for me. As an additional symptom my vision is slightly blurred too."
				GERD : "I have a burning sensation in my chest, I describe it like \"fire\" inside my. When eating, I find it more difficult to swallow the food, therefore I eat and immediately drink water, usually cold water because of the \"fire\" feeling... Also I cough a lot and noticed that now I have a bad breath issue."
				hyperthyroidism: "I have a very high pulse rate and high temperature"
		*/
		connectorStr = ['the', 'and', 'or'];
		relevantStr = ['pain', 'coughing', 'sneezing'];
		jsonOnly = false;
		wordsMatch = {};
		filter_diseases = function(limit) {
			var callUrl, filtered, outString, symptoms, word, _i, _len;
			outString = $("#symptoms").val().replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
			symptoms = outString.split(/[\s,]+/);
			filtered = [];
			callUrl = 'api/diagnose?symptoms=' + outString + '&limit=' + limit;
			$.get(callUrl, function(msg) {
				$("#json").html(JSON.stringify(msg, null, 4));
				wordsMatch = msg.diseases;
				return generate(wordsMatch);
			}).error(function(err) {
				return console.log("Error");
			});
			for (_i = 0, _len = symptoms.length; _i < _len; _i++) {
				word = symptoms[_i];
				if (__indexOf.call(connectorStr, word) >= 0) {
					filtered.push('<span class="connector">' + word + '</span>');
				} else if (__indexOf.call(relevantStr, word) >= 0) {
					filtered.push('<span class="relevant">' + word + '</span>');
				} else {
					filtered.push(word);
				}
			}
			return $("#filtered-symptoms").html(filtered.join(','));
		};
		$("#symptoms").keyup(function(ev) {
			return filter_diseases(+d3.select("#max").property("value"));
		});
		$("#dataSwitch").on('click', function(ev) {
			jsonOnly = !jsonOnly;
			if (jsonOnly) {
				$("#dataSwitch .label").html("Switch to Word Cloud");
				$("#json").show();
				return $("#wordcloud").hide();
			} else {
				$("#dataSwitch .label").html('Switch to JSON');
				$("#json").hide();
				return $("#wordcloud").show();
			}
		});
		$("input[type=radio], #font, #max").change(function() {
			max = +d3.select("#max").property("value");
			if (max > 30) d3.select("#max").property("value", 30);
			filter_diseases(max);
		});
		return bar = new ProgressBar.Line(progressBar, {
			strokeWidth: 4,
			color: '#CDCDFF',
			trailColor: '#F3F3F3',
			trailWidth: 1,
			svgStyle: {
				width: '100%',
				height: '100%',
				autoStyleContainer: false
			}
		});
	});

}).call(this);
