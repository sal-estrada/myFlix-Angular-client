import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-genre-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './genre-dialog.html',
  styleUrl: './genre-dialog.scss'
})
export class GenreDialog {
  data = inject(MAT_DIALOG_DATA);
}
