angular.module('starter.services', [])

.factory('Location', function($window, $rootScope, $q) {
  function isSupported() {
    return $window.navigator.geolocation;
  };
  
  var location = {
    getCurrent: function(options) {
      var deferred = $q.defer();
      if (isSupported()) {
        $window.navigator.geolocation.getCurrentPosition(
          function(position) {
            $rootScope.$apply(function() {
              deferred.resolve(position);
            });
          },
          function(error) {
            $rootScope.$apply(function() {
              deferred.reject({error: error});
            });
          }, options);
      } else {
        deferred.reject({
          error: {
            code: 2,
            message: 'Geolocation is not supported.'
          }
        });
      }
      return deferred.promise;
    }
  };
  
  return location;
})

.factory('Weather', function($http) {
  var appId = '066e7359820f382914a2eff95cad643a';
  
  var weather = {
    getForcast: function(lat, lng) {
      return $http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + appId + '&units=imperial');
    }
  };
  
  return weather;
})

.factory('Trip', function($window, $http) {
  var trip = {
    save: function(trip) {
      return $http.post('https://cycle-houston-lparks88.c9users.io/api/trips/', trip);
    },
    saveLocal: function(trip) {
      var history = this.getAll() || [];
      history.push(trip);
      $window.localStorage.setItem('tripHistory', JSON.stringify(history));
    },
    getAll: function() {
      return JSON.parse($window.localStorage.getItem('tripHistory'));
    }
  };
  
  return trip;
})

.factory('Profile', function($window, $http) {
  var profile = {
    get: function() {
      return JSON.parse($window.localStorage.getItem('profile'));
    },
    save: function(profile) {
      return $http.post('https://cycle-houston-lparks88.c9users.io/api/profiles/', profile);
    },
    saveLocal: function(profile) {
      $window.localStorage.setItem('profile', JSON.stringify(profile));
    }
  };
  
  return profile;
});