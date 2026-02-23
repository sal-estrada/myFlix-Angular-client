import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-director-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './director-dialog.html',
  styleUrl: './director-dialog.scss'
})
export class DirectorDialog {
  data = inject(MAT_DIALOG_DATA);
}
