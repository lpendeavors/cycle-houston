angular.module('starter.controllers', [])

.controller('TripsCtrl', function($scope, $controller, $rootScope, $ionicHistory, $state, Location, Weather, Profile, Trip) {
  Location.getCurrent().then(function(location){
    getWeather(location.coords);
  });
  
  function getWeather(coords) {
    Weather.getForcast(coords.latitude, coords.longitude)
    .success(function(data) {
      $scope.weather = data;
    })
    .error(function(error) {
      $scope.weather = {
        "coord": {
          "lon": -95.37,
          "lat": 29.74
        },
        "weather": [
          {
            "id": 802,
            "main": "Clouds",
            "description": "scattered clouds",
            "icon": "03d"
          }
        ],
        "base": "stations",
        "main": {
          "temp": 80.1,
          "pressure": 1021,
          "humidity": 28,
          "temp_min": 78.8,
          "temp_max": 82.4
        },
        "visibility": 16093,
        "wind": {
          "speed": 8.05,
          "deg": 210
        },
        "clouds": {
          "all": 40
        },
        "dt": 1491598500,
        "sys": {
          "type": 1,
          "id": 2638,
          "message": 0.0055,
          "country": "US",
          "sunrise": 1491566552,
          "sunset": 1491612261
        },
        "id": 4699066,
        "name": "Houston",
        "cod": 200
      };
    });
  }
  
  $rootScope.$on('Trip started', function() {
    $scope.started = true;
  });
  
  $rootScope.$on('Trip ended', function() {
    $scope.started = false;
  });
  
  $rootScope.$on('Trip saved', function() {
    $scope.tripHistory = Trip.getAll();
  });
  
  if (Profile.get()) {
    $scope.hasProfile = true;
  }
  
  $scope.tripHistory = Trip.getAll();
})

.controller('DetailsCtrl', function($scope, $stateParams, Trip) {
  var history = Trip.getAll();
  history.forEach(function(h) {
    if(h._id === $stateParams.id) {
      $scope.trip = h;
      
      var lastIndex = h.points.length - 1;
      $scope.endMarker = {
        draggable: false,
        lat: h.points[lastIndex].lat,
        lng: h.points[lastIndex].lng
      };
    }
  });
  
  angular.extend($scope, {
    detailCenter: {
      lat: $scope.trip.points[0].lat,
      lng: $scope.trip.points[0].lng,
      zoom: 13
    },
    detailMarkers: {
      start: {
        draggable: false,
        lat: $scope.trip.points[0].lat,
        lng: $scope.trip.points[0].lng
      },
      end: $scope.endMarker
    },
    detailPaths: {
      trip: {
        color: '#FF0000',
        weight: 8,
        latlngs: $scope.trip.points
      }
    },
    tiles: {
      url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}',
      options: {
        attribution: 'Tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png'
      }
    }
  });
  
  var tripPoints = $scope.trip.points;
  $scope.playRide = function() {
    $scope.isPlaying = true;
    $scope.detailPaths.trip.points = [];
    
    tripPoints.forEach(function(tp) {
      $scope.detailPaths.trip.points.push(tp);
    });
    $scope.isPlaying = false;
  };
})

.controller('RecordCtrl', function($scope, $rootScope, $window, $ionicPopup, $state, $interval, Location, Trip, Profile) {
  getCenter();
  function getCenter() {
    Location.getCurrent().then(function(location) {
    $scope.mapCenter = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      zoom: 13
    };
  });
  }

  $scope.setTripType = function(tripType){
    $scope.tripType = tripType;
  };
  
  angular.extend($scope, {
    mapCenter: {},
    markers: {
      start: { 
        draggable: false,
        lat: '',
        lng: ''
      },
      end: { 
        draggable: false,
        lat: '',
        lng: ''
      }
    },
    paths: {
      trip: {
        color: '#FF0000',
        weight: 8,
        latlngs: []
      }
    },
    tiles: {
      url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}',
      options: {
        attribution: 'Tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png'
      }
    }
  });
  
  var lastPoint = {}, watchId;
  $scope.totalDistance = 0;
  $scope.startWatching = function() {
    $scope.started = true;
    $rootScope.$emit('Trip started');
    watchId = $window.navigator.geolocation.watchPosition(
      function(position) {
        var point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if(!lastPoint.lat && !lastPoint.lng) {
          $scope.markers.start = point;
        }
        if (point.lat === lastPoint.lat && point.lng === lastPoint.lng) {
          // Do not update point
          return;
        } else {
          $scope.$apply(function() {
            $scope.paths.trip.latlngs.push({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          });
          
          var distance = 0;
          if (lastPoint.lat && lastPoint.lng) {
            distance = $scope.distanceFormula(lastPoint.lat, lastPoint.lng, point.lat, point.lng);
          }
          
          $scope.$apply(function() {
            $scope.totalDistance += distance;
          });
          
          if(position.coords.speed) {
            $scope.$apply(function() {
              $scope.curSpeed = position.coords.speed * 2.23694;
            });
            calculateAvgSpeed(position.coords.speed);
          }
          
          lastPoint = point;
        }
      },
      function(error) {
        console.log(error);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 100
      });
  };
  
  var tripObj = {};
  $scope.beginTrip = function() {
    showPopup();
    tripObj.startTime = Date.now();
  };
  
  function showPopup() {
    $ionicPopup.show({
      template: `<ion-radio ng-model="tripType" ng-value="'Work'" ng-click="setTripType('work')">Work</ion-radio>
                <ion-radio ng-model="tripType" ng-value="'School'" ng-click="setTripType('school')">School</ion-radio>
                <ion-radio ng-model="tripType" ng-value="'Errand'" ng-click="setTripType('errands')">Errand</ion-radio>
                <ion-radio ng-model="tripType" ng-value="'Leisure'" ng-click="setTripType('leisure')">Leisure</ion-radio>
                <ion-radio ng-model="tripType" ng-value="'Other'" ng-click="setTripType('other')">Other</ion-radio>`,
      title: 'What type of trip?',
      subTitle: 'Select One',
      scope: $scope,
      buttons: [
        { 
          text: 'Cancel',
          onTap: function(e) {
            $scope.tripType = undefined;
          }
        },
        {
          text: 'Begin',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.tripType) {
              e.preventDefault();
            } else {
              $scope.startWatching();
              $scope.timer();
            }
          }
        }
      ]
    });
  }
  
  $scope.endTrip = function() {
    var confirmEnd = $ionicPopup.confirm({
      title: 'Confirm End',
      template: 'Are you sure?'
    });
    
    confirmEnd.then(function(res) {
      if (res) {
        $scope.markers.end.lat = $scope.paths.trip.latlngs[$scope.paths.trip.latlngs.length-1].lat;
        $scope.markers.end.lng = $scope.paths.trip.latlngs[$scope.paths.trip.latlngs.length-1].lng;
        
        $window.navigator.geolocation.clearWatch(watchId);
        $interval.cancel(intervalId);
        $scope.started = false;
        $rootScope.$emit('Trip ended');
        
        tripObj.endTime = Date.now();
        tripObj.type = $scope.tripType;
        tripObj.points = $scope.paths.trip.latlngs;
        tripObj.duration = $scope.tripTimer;
        tripObj.distance = $scope.totalDistance;
        
        // Check for profile
        if (Profile.get()) {
          tripObj.profile = Profile.get()._id;
        }
        
        Trip.save(tripObj)
        .success(function(data) {
          tripObj._id = data._id;
          tripObj.avgSpeed = $scope.avgSpeed;
          Trip.saveLocal(tripObj);
          
          $ionicPopup.alert({
            title: 'Trip saved!',
            template: 'Thanks for your support'
          });
          $scope.tripSaved = true;
          $rootScope.$emit('Trip saved');
          
          resetTrip();
          console.log($scope.paths.trip);
        })
        .error(function(err) {
          console.log(err);
        });
      }
    });
  };
  
  function resetTrip() {
    $scope.tripType = undefined;
    $scope.paths.trip.latlngs = [];
    $scope.tripTimer = 0;
    $scope.totalDistance = 0;
    
    tripObj = {};
    getStart();
  }
  
  $scope.avgSpeed = undefined;
  var allSpeeds = [];
  function calculateAvgSpeed(newSpeed) {
    allSpeeds.push(newSpeed);
    
    var sum = 0;
    allSpeeds.forEach(function(s) {
      sum += s;
    });
    
    $scope.$apply(function() {
      $scope.avgSpeed = (sum / allSpeeds.length) * 2.23694;
    });
  }
  
  $scope.tripTimer = 0;
  var intervalId;
  $scope.timer = function() {
    var startTime = new Date();
    intervalId = $interval(function() {
      var actualTime = new Date();
      $scope.tripTimer = Math.floor((actualTime - startTime) / 1000);
    }, 1000);
  };
  
  $scope.distanceFormula = function(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  }
})

.controller('ProfileCtrl', function($scope, $window, Profile) {
  $scope.profile = Profile.get() || {};
  
  $scope.saveProfile = function() {
    if(!angular.equals($scope.profile, {})) {
      Profile.save($scope.profile)
      .success(function(data) {
        Profile.saveLocal(data);
        $scope.profileSaved = true;
      })
      .error(function(err) {
        console.log(err);
      });
    } 
  };
  
  
});