import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../../shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-room-review-modal',
  imports: [CommonModule, SharedModule, DialogModule, RatingModule],
  providers: [MessageService],
  templateUrl: './room-review-modal.component.html',
  styleUrl: './room-review-modal.component.scss',
  standalone: true,
})
export class RoomReviewModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() roomId: number | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() reviewSubmitted = new EventEmitter<any>();

  reviewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.resetForm();
    }
  }

  onHide() {
    this.resetForm(); 
    this.visibleChange.emit(false);
  }

  submitReview() {
    if (this.reviewForm.invalid) {
      this.markFormGroupTouched(this.reviewForm);
      return;
    }
    
    const reviewData = {
      calificacion: this.reviewForm.value.rating,
      comentario: this.reviewForm.value.comment
    };
    
    this.reviewSubmitted.emit(reviewData);
    this.resetForm();
  }


  private resetForm() {
    this.reviewForm.reset({
      rating: 0,
      comment: ''
    });
    
    this.reviewForm.markAsUntouched();
    this.reviewForm.markAsPristine();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}