import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  @ViewChild('map') divMap?: ElementRef;

  @Input() lngLat?: [number, number];
  
  public map?: Map;

  ngAfterViewInit(): void {
    if ( !this.divMap?.nativeElement ) throw "Map Div not found";
    if ( !this.lngLat ) throw "LngLat can't be null";

    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.lngLat,
      zoom: 14,
      interactive: false
    });

    new Marker()
      .setLngLat(this.lngLat)
      .addTo( this.map );
  }

}
