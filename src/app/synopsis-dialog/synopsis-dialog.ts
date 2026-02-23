import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-synopsis-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './synopsis-dialog.html',
  styleUrl: './synopsis-dialog.scss'
})
export class SynopsisDialog {
  data = inject(MAT_DIALOG_DATA);
}
