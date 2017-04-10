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

.controller('DetailsCtrl', function($scope, $stateParams, $interval, Trip) {
  var history = Trip.getAll(), lastIndex;
  history.forEach(function(h) {
    if(h._id === $stateParams.id) {
      $scope.trip = h;
      
      lastIndex = h.points.length - 1;
      $scope.endMarker = {
        draggable: false,
        lat: h.points[lastIndex].lat,
        lng: h.points[lastIndex].lng
      };
    }
  });
  
  $scope.trip.points = [
    { lat: 29.741989, lng: -95.3695423 },
    { lat: 29.7420358, lng: -95.3695015 },
    { lat: 29.7420166, lng: -95.36953 },
    { lat: 29.7420076, lng: -95.3695487 },
    { lat: 29.7420115, lng: -95.3695668 },
    { lat: 29.7420163, lng: -95.3695798 },
    { lat: 29.7420196, lng: -95.3695877 },
    { lat: 29.7420157, lng: -95.3695852 },
    { lat: 29.7420173, lng: -95.369591 },
    { lat: 29.7420184, lng: -95.3695939 },
    { lat: 29.7420185, lng: -95.3695945 },
    { lat: 29.742019, lng: -95.369594 },
    { lat: 29.7420266, lng: -95.3695901 },
    { lat: 29.7420265, lng: -95.3695903 },
  ];
  
  angular.extend($scope, {
    detailCenter: {
      lat: $scope.trip.points[0].lat,
      lng: $scope.trip.points[0].lng,
      zoom: 13
    },
    detailMarkers: {
      start: $scope.startMarker,
      end: $scope.endMarker
    },
    detailPaths: {
      trip: {
        color: '#FF0000',
        weight: 8,
        latlngs: $scope.trip.points
      },
      replay: {
        color: '#0000FF',
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
  
  var intervalId;
  $scope.playRide = function() {
    $scope.isPlaying = true;
    $scope.startMarker = {
      lat: $scope.trip.points[0].lat,
      lng: $scope.trip.points[0].lng
    };
    $scope.detailPaths.trip.latlngs = [];
    
    var i = 0, l = $scope.trip.points.length;
    intervalId = $interval(function() {
      if(i < l) {
        $scope.detailPaths.replay.latlngs.push($scope.trip.points[i]);
        i++;
      } else {
        $interval.cancel(intervalId);
        $scope.isPlaying = false;
        $scope.detailPaths.replay.latlngs = [];
        $scope.detailPaths.trip.latlngs = $scope.trip.points;
        $scope.endMarker = {
          draggable: false,
          lat: $scope.trip.points[lastIndex].lat,
          lng: $scope.trip.points[lastIndex].lng
        };
      }
    }, 50);
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
    $scope.markers.currentPos = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  });
  }

  $scope.setTripType = function(tripType){
    $scope.tripType = tripType;
  };
  
  var markerIcons = {
    startIcon: {
      iconUrl: 'img/start-marker.svg'
    },
    endIcon: {
      iconUrl: 'img/end-marker.png'
    }
  };
  
  angular.extend($scope, {
    mapCenter: {},
    markers: {
      currentPos: {
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
        
        if (point.lat === lastPoint.lat && point.lng === lastPoint.lng) {
          // Do not update point
          return;
        } else {
          $scope.$apply(function() {
            $scope.paths.trip.latlngs.push({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            $scope.markers.currentPos = point;
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
    $scope.avgSpeed = undefined;
    $scope.curSpeed = undefined;
    
    tripObj = {};
    getCenter();
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