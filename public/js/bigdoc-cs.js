// Generated by CoffeeScript 1.9.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.thecloud = null;

  window.drawfunc = null;

  window.wordsMatch = null;

  $(function() {

    /*
    	#TODO: Implement word quantity by slider
    	$('#cloudCount').slider {
    		formatter : (value) ->
    			return "abc: " + value
    		}
     */

    /*
    	exampleDiseases = 
    		cold : "I cough often and have runny, stuffy nose. My troat is sore and congested. I've been sneezing a lot recently and I feel fatigued even when doing usual tasks like going upstairs.",
    		#pneumonia :  "I am 60 years old. My main symptom is fever and cough and green mucus sometimes tinged with a bit of blood. My heartbeat is faster than usual and feel more tired and weak than usual.", #No longer used as it its symptoms are too difficult to notice...
    		diabetes : "I constanly feel thirsty, like if I couldn't quench my thirst. By this reason I'm going to the bathroom very often, I go pee like 12 or 15 times a day when I would usually go like 4 times as much. Also, waking up and going to pee in the middle of the night is becoming really usual and annoying for me. As an additional symptom my vision is slightly blurred too."
    		GERD : "I have a burning sensation in my chest, I describe it like \"fire\" inside my. When eating, I find it more difficult to swallow the food, therefore I eat and immediately drink water, usually cold water because of the \"fire\" feeling... Also I cough a lot and noticed that now I have a bad breath issue."
     */
    var connectorStr, filter_diseases, jsonOnly, relevantStr;
    connectorStr = ['the', 'and', 'or'];
    relevantStr = ['pain', 'coughing', 'sneezing'];
    jsonOnly = false;
    filter_diseases = function() {
      var callUrl, filtered, outString, symptoms, word, _i, _len;
      outString = $("#symptoms").val().replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
      symptoms = outString.split(/[\s,]+/);
      filtered = [];
      callUrl = 'api/diagnose?symptoms=' + outString;
      console.log(callUrl);
      $.get(callUrl, function(msg) {
        console.log(msg);
        $("#json").html(JSON.stringify(msg, null, 4));
        window.wordsMatch = msg.diseases;
        return generate();
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
      return filter_diseases();
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
    return $("input[type=radio], #font, #max").change(function() {
      return generate();
    });
  });

}).call(this);
