import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyControlPanelComponent } from './strategy-control-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { LetModule } from '../../../../../../../libs/template/src/lib/let';



@NgModule({
  declarations: [StrategyControlPanelComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    LetModule
  ],
  exports: [StrategyControlPanelComponent]
})
export class StrategyControlPanelModule { }
