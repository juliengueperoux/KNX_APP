import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export default class UtilsService{

  public snackBar : MatSnackBar;

  constructor( private s: MatSnackBar) { 
    this.snackBar = s;
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
  }

}
