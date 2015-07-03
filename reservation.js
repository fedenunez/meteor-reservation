// model definition
Fruteras = new Mongo.Collection("fruteras")

// the cliente
if (Meteor.isClient) {

    // This code only runs on the client
    angular.module("simple-reservation",['angular-meteor']);

    // app controller
    angular.module("simple-reservation").controller("ReservationListCtrl", ['$scope','$meteor','$interval',
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
        frutera.until = (new Date()).setHours( frutera.since.getHours() + 1 );
      }

      $scope.clean = function(frutera) {
        frutera.since = new Date();
        frutera.until = null;
        frutera.usedBy = "";
      }

      $scope.increase = function(frutera,x) {
        if (!frutera.until) {
          frutera.until = new Date();
          frutera.since = new Date();
        } else {
          frutera.until = new Date(frutera.until);
        }
        frutera.until = frutera.until.setHours( frutera.until.getHours() + x );
      };
    }]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
