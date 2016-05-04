// model definition
Fruteras = new Mongo.Collection("fruteras")
Logs = new Mongo.Collection("log")

// the cliente
if (Meteor.isClient) {
  // This code only runs on the client
  angular.module("simple-reservation",['angular-meteor']);



Meteor.startup(function() {
  console.log("startup");
  angular.bootstrap(document, ['simple-reservation']);
});
  function onReady() {
    console.log("onReady");
  }

  if (Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
  else
    angular.element(document).ready(onReady);

  // simple filter to show minutes in a human readable forme
  angular.module("simple-reservation").filter('duration', function() {
    return function(input) {
      var output = '';
      if (0 < input && input < 60) {
        output = Math.floor(input) + 'mins'; 
      } else if (60 <= input && input < 24*60) {
        output = Math.floor(input/60*10)/10 + 'hrs'; 
      } else if (24*60 <= input && input < 24*30*60) {
        output = Math.floor(input/60/24*10)/10 + 'days'; 
      } else if (24*30 == input) {
        output = Math.floor(input/60/24/30*10)/10 + 'month'; 
      } else if (24*30 < input) {
        output = Math.floor(input/60/24/30*10)/10 + 'months'; 
      }
      return output;
    };
  });

  // app controller
  angular.module("simple-reservation")
  .controller("ReservationListCtrl", ['$scope','$meteor','$interval',
              function($scope, $meteor, $interval){

                $scope.date;
                $scope.fruteras = $meteor.collection(Fruteras);

                // compute reservation state
                var computeReservations = function() {
                  $scope.date = new Date();
                  $scope.fruteras.forEach( function (f) {
                    var since = new Date( f.since );
                    var until = new Date( f.until );
                    if ( (since <= $scope.date) && ($scope.date <= until)
                       ) {
                         f.state = 'reserved';
                       } else {
                         f.state = 'free';
                       }
                  });
                }

                // compute evert 10 secons on when something change in the collection
                $interval( computeReservations , 10000);
                $scope.$watchCollection ( $scope.fruteras, computeReservations );

                // scope actions ===============================
                $scope.update = function(frutera) {
                  frutera.since = new Date();
                  var until = new Date( frutera.until );
                  // it should be reserved at least for one hour
                  if (frutera.since >= frutera.until) {
                    frutera.until = (new Date()).setHours( frutera.since.getHours() + 1 );
                  }
                }

                $scope.clean = function(frutera) {
                  frutera.until = null;
		  // speed up refreash by directly calling compute (it will be called again by the watch in a little while)
		  computeReservations();
                }

                $scope.increase = function(frutera,x) {
                  $scope.date = new Date();
                  if (!frutera.until || ($scope.date > new Date(frutera.until) )) {
                    frutera.until = new Date();
                    frutera.since = new Date();
                  } else {
                    frutera.until = new Date(frutera.until);
                  }
                  frutera.until = frutera.until.setHours( frutera.until.getHours() + x );
                };
                // speed up refreash by directly calling compute (it will be called again by the watch in a little while)
                computeReservations();
              }]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
