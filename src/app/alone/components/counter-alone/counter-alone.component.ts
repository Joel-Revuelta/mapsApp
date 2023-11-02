import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'counter-alone',
  standalone: true,
  templateUrl: './counter-alone.component.html'
})
export class CounterAloneComponent {

  @Input()
  public counter: number = 10;

}
