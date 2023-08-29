import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatInputModule} from '@angular/material/input'
import {MatGridListModule} from '@angular/material/grid-list'
import {} from '@angular/material'
import {} from '@angular/material'
import {} from '@angular/material'
import {} from '@angular/material'
import {} from '@angular/material'



const material = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatGridListModule
]


@NgModule({
  declarations: [],
  imports: [
    material
  ],
  exports:[
    material

  ]
})
export class MaterialModule { }
