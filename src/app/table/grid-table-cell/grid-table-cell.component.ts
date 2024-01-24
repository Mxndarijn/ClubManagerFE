import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-grid-table-cell',
  standalone: true,
  imports: [],
  templateUrl: './grid-table-cell.component.html',
  styleUrl: './grid-table-cell.component.css'
})
export class GridTableCellComponent {
@Input() label: string = ''
}
