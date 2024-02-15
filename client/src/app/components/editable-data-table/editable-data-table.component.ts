import { CommonModule } from '@angular/common'; 
import {Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeysPipe } from './editable-data-table-keysPipe'
import { PrnObject } from '@services';

@Component({
  selector: 'app-editable-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    KeysPipe
    ],
  templateUrl: './editable-data-table.component.html',
  styleUrl: './editable-data-table.component.scss'
})
export class EditableDataTableComponent implements OnInit{
  @Input() dataArray: PrnObject[] = [];

  constructor() { }

  ngOnInit(): void {
  }
  

  deleteRow(index: number): void {
    this.dataArray.splice(index, 1);
  }
}
