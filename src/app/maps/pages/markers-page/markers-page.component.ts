import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  marker: Marker;
  color: string;
}

interface PlainMarker {
  lngLat: number[];
  color: string;
}

@Component({
  selector: 'maps-markers',
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];

  public map?: Map;
  public currentCLngLat: LngLat = new LngLat(2.17, 41.40);

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'HTML element not found';

    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.currentCLngLat,
      zoom: 13
    });

    this.readFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.markers.forEach( marker => marker.marker.remove() );
  }

  createMarker() {
    if ( !this.map ) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat, color);
  }

  addMarker( lngLat: LngLat, color: string ) {
    if ( !this.map ) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat( lngLat )
      .addTo( this.map );

    marker.on('dragend', () => this.saveToLocalStorage() );
    
    this.markers.push( { marker, color } );
    this.saveToLocalStorage();
  }

  deleteMarker( i: number ) {
    this.markers[i].marker.remove();
    this.markers.splice( i, 1 );
    this.saveToLocalStorage();
  }

  flyTo( marker: Marker ) {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    });
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ marker, color }) => {

      return {
        lngLat: marker.getLngLat().toArray(),
        color
      };
    });

    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ));
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString );

    plainMarkers.forEach( ({lngLat, color}) => {
      const [ lng, lat ] = lngLat;
      const coords = new LngLat( lng, lat );

      this.addMarker(coords, color);
    });
  }

}
