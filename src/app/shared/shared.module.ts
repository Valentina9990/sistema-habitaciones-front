import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Módulos de Angular comunes
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Módulos de PrimeNG 
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
@NgModule({
  imports: [
    // Módulos de Angular necesarios
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    // Módulos de Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Módulos de PrimeNG
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    CardModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    SelectButtonModule,
    MessagesModule,
    ToastModule,
    MenuModule,
    ProgressSpinnerModule,
    TagModule,
  ],
  declarations: [
    // 
  ]
})
export class SharedModule { }