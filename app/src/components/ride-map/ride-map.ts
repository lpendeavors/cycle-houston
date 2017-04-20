import { Component, OnInit, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationProvider } from '../../providers/location-provider';
import { RideProvider } from '../../providers/ride-provider';

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
  
  private markerLayer: any;
  private marker: any;
  private pathLayer: any;
  private path: any;
  public map: any;
  public mapId: string;
  
  constructor(
    public zone: NgZone,
    public navCtrl: NavController,
    public locationProvider: LocationProvider,
    public rideProvider: RideProvider
  ) {}
  
  loadMap(): void {
    // Generate map id to prevent dubplicate id error
    let id = Math.random();
    this.mapId = `map-${id}`;
    
    // Find current location
    this.locationProvider.getPosition().then(pos => {
      // Initialize map
      this.map = new L.Map(this.mapId);
      // Set center
      this.map.setView(new L.LatLng(pos.coords.latitude, pos.coords.longitude), 12);
      // Add tile layer to map
      new L.TileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
        attribution: 'Tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 9,
        maxZoom: 18
      }).addTo(this.map);
      // Create layer groups for marker and path
      this.markerLayer = new L.LayerGroup([]).addTo(this.map);
      this.pathLayer = new L.LayerGroup([]).addTo(this.map);
      
      this.setPath();
    });
  }
  
  setPath(): void {
    // Create path line
    this.path = new L.Polyline([], { color: 'red', weight: 5 }).addTo(this.pathLayer);
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
        // Clear marker and path layer contents
        this.pathLayer.clearLayers();
        this.markerLayer.clearLayers();
        
        // Add fresh path layer
        this.setPath();
      });
    })
  }
  
}
