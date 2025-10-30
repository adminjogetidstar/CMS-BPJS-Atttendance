import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-protected-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './protected-layout.html',
  styleUrl: './protected-layout.scss',
})
export class ProtectedLayout {

}
