# Custom coffee code goes here (client side, angularjs)
# Ideal for AngularJS logic.
# MEAN Boilerplate by @Jmlevick <http://jmlevick.me>
# License: Coffeeware <https://github.com/Jmlevick/coffeeware-license>

app = angular.module 'bigdoc-app', []

app.controller 'exampleCtrl', ($scope, $http) ->
	console.log 'exampleCtrl'
	
	$scope.$watch 'inputCh', (newText) ->
		#console.log 'inputCh changed ' + newText
		($http.get 'api/diagnose?symptoms=' + newText).success((data, status, headers, config) ->
			#console.log JSON.stringify data
			#Format data to show only the "results" key here in integers
			$scope.resultJSON = data;
		).error((data, status, headers, config) ->
			#log error
		);
    
	return
