import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    const appRoot = this.elRef.nativeElement;
    appRoot.removeAttribute('aria-hidden');
  }
}
