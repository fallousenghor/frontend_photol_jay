import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from "./components/toast/toast.component";
import { ScrollTopComponent } from "./components/scroll-top/scroll-top.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastComponent,
    ScrollTopComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
