import { Component, OnInit, NgZone, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationProvider } from '../../providers/location-provider';
import { RideProvider } from '../../providers/ride-provider';
import { RideModel } from '../../models/ride-model';
import { Observable } from 'rxjs/Rx';

import 'leaflet';

/**
 * Generated class for the TripMap component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'ride-map',
  templateUrl: 'ride-map.html'
})
export class RideMap implements OnInit {
  
  // From the rideDetail component (optional)
  @Input() existingRide?: RideModel;
  
  private markerLayer: any;
  private marker: any;
  private pathLayer: any;
  private path: any;
  private map: any;
  private mapId: string;
  private isPlaying: boolean;
  
  constructor(
    public zone: NgZone,
    public navCtrl: NavController,
    public locationProvider: LocationProvider,
    public rideProvider: RideProvider
  ) {}
  
  loadMap(): void {
    // Generate map id to prevent dubplicate map container error
    let id = Math.random();
    this.mapId = `map-${id}`;
    // Find current location
    this.locationProvider.getPosition().then(pos => {
      // Initialize map
      this.map = new L.Map(this.mapId);
      // Add tile layer to map
      new L.TileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
        attribution: 'Tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 9,
        maxZoom: 18
      }).addTo(this.map);
      // Create layer groups for marker and path
      this.markerLayer = new L.LayerGroup([]).addTo(this.map);
      this.pathLayer = new L.LayerGroup([]).addTo(this.map);
      // Add polyline to pathLayer
      this.setPath();
      // Check for existingRide
      if (this.existingRide) {
        // Fit map bounds to ride path
        this.map.fitBounds(new L.LatLngBounds(this.existingRide.points));
        // Set path array to ride coordinates
        this.path.setLatLngs(this.existingRide.points);
        // Set markers
        const startMarker = new L.Marker([this.existingRide.points[0].lat, this.existingRide.points[0].lng]);
        const endMarker = new L.Marker([this.existingRide.points[this.existingRide.points.length-1].lat, this.existingRide.points[this.existingRide.points.length-1].lng]);
        startMarker.addTo(this.markerLayer);
        endMarker.addTo(this.markerLayer);
      } else {
        // Set center and zoom to current location
        this.map.setView(new L.LatLng(pos.coords.latitude, pos.coords.longitude), 12);
      }
    });
  }
  
  setPath(): void {
    // Create new polyline for ride path
    this.path = new L.Polyline([], { color: 'red', weight: 5 }).addTo(this.pathLayer);
  }
  
  clearLayers(): void {
    // Clear marker and path layer contents
    this.pathLayer.clearLayers();
    this.markerLayer.clearLayers();
  }
  
  clearPath(): void {
    // Add fresh path layer
    this.setPath();
  }
  
  startReplay(): void {
    // Update playing indicator
    this.isPlaying = true;
    this.zone.run(() => {
      // Reset path
      this.pathLayer.clearLayers();
      this.setPath();
    });
    // Create timer for auto incrementing
    let counter = Observable.timer(0, 50);
    // Create timer subscription
    let subscription = counter.subscribe(t => {
      this.zone.run(() => {
        // Push ride coordinates to path
        this.path.addLatLng(new L.LatLng(this.existingRide.points[t].lat, this.existingRide.points[t].lng));
      });
      // Check if end of array
      if (t === this.existingRide.points.length-1) {
        // End timer to stop incrementing
        subscription.unsubscribe();
        // Update playing indicator
        this.isPlaying = false;
      }
    });
  }
  
  ngOnInit(): void {
    // Load map
    this.loadMap();
    
    // Subscribe to rideUpdate event
    this.rideProvider.rideUpdate.subscribe((ride) => {
      this.zone.run(() => {
        // Update path array with new ride data
        this.path.setLatLngs(ride);
        // Create or update marker
        if (this.path.getLatLngs().length === 1) {
          this.marker = new L.Marker([ride[0].lat, ride[0].lng]).addTo(this.markerLayer);
        } else {
          this.marker.setLatLng([ride[ride.length-1].lat, ride[ride.length-1].lng]);
        }
      })
    });
    
    // Subscribe to rideEnd event
    this.rideProvider.rideEnded.subscribe(() => {
      this.zone.run(() => {
        // Reset map
        this.clearLayers();
        this.clearPath();
      });
    });
  }
  
}
