import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Room } from '../../shared/models/room';
import { finalize } from 'rxjs';
import { RoomService } from '../../shared/services/room.service';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ReservationService } from '../../shared/services/reservation.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    CardModule,
    DividerModule,
    RadioButtonModule,
    FormsModule,
    DialogModule,
    SelectModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent implements OnInit {
  room?: Room;
  roomId?: number;
  loading = false;
  error = false;
  reservationForm: FormGroup;
  guestOptions: any[] = [];
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  minDate: Date = new Date();
  disabledDates: Date[] = [];
  paymentOption: string = 'full';
  displayConfirmationModal: boolean = false;
  paymentAmount: number = 0;
  displaySuccessModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {
    this.reservationForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: [
        '',
        [Validators.required, this.validateCheckOutDate.bind(this)],
      ],
      guests: [1, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
      paymentOption: ['full', Validators.required],
    });
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    if (roomId) {
      this.roomId = +roomId;
      this.loadRoomDetails(this.roomId);
    } else {
      this.router.navigate(['/rooms']);
    }
  }

  loadRoomDetails(roomId: number): void {
    this.loading = true;
    this.error = false;

    this.roomService
      .getRoomById(roomId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (room) => {
          this.room = room;
          this.setupGuestOptions();
        },
        error: (err) => {
          console.error('Error loading room details:', err);
          this.error = true;
        },
      });
  }

  setupGuestOptions(): void {
    if (this.room) {
      this.guestOptions = [];
      for (let i = 1; i <= this.room.capacidad; i++) {
        this.guestOptions.push({
          label: i === 1 ? '1 huésped' : `${i} huéspedes`,
          value: i,
        });
      }
    }
  }

  private setupDateListeners(): void {
    this.reservationForm.get('checkIn')?.valueChanges.subscribe((checkIn) => {
      this.checkInDate = checkIn;
      this.updateDisabledDates();
    });

    this.reservationForm.get('checkOut')?.valueChanges.subscribe((checkOut) => {
      this.checkOutDate = checkOut;
    });
  }

  private validateCheckOutDate(
    control: AbstractControl
  ): ValidationErrors | null {
    const checkIn = this.reservationForm?.get('checkIn')?.value;
    const checkOut = control.value;

    if (checkIn && checkOut) {
      const minCheckOut = new Date(checkIn);
      minCheckOut.setDate(minCheckOut.getDate());

      if (new Date(checkOut) < minCheckOut) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  private updateDisabledDates(): void {
    if (this.checkInDate) {
      const disabledDates = [];
      const minCheckOut = new Date(this.checkInDate);
      minCheckOut.setDate(minCheckOut.getDate());

      const tempDate = new Date(this.minDate);
      while (tempDate < minCheckOut) {
        disabledDates.push(new Date(tempDate));
        tempDate.setDate(tempDate.getDate() + 1);
      }

      this.disabledDates = disabledDates;
    } else {
      this.disabledDates = [];
    }
  }

  calculateNights(): number {
    const checkIn = this.reservationForm.get('checkIn')?.value;
    const checkOut = this.reservationForm.get('checkOut')?.value;

    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  calculateTaxes(): number {
    if (!this.room) return 0;
    let subtotal: number;
    if (this.calculateNights() <= 0) {
      subtotal = this.room.precioNoche * (this.calculateNights() + 1);
    } else {
      subtotal = this.room.precioNoche * this.calculateNights();
    }
    return subtotal * 0.19;
  }

  calculateTotal(): number {
    if (!this.room) return 0;
    let subtotal: number;
    if (this.calculateNights() <= 0) {
      subtotal = this.room.precioNoche * (this.calculateNights() + 1);
    } else {
      subtotal = this.room.precioNoche * this.calculateNights();
    }
    return subtotal + this.calculateTaxes();
  }

  getIncludedServices(): string {
    return (
      this.room?.serviciosIncluidos?.map((s) => s.nombre).join(', ') ||
      'No hay servicios incluidos'
    );
  }

  getAdditionalServices(): string {
    const services = this.room?.serviciosAdicionales?.map((s) =>
      s.precio ? `${s.nombre} (${s.precio})` : s.nombre
    );
    return services?.join(', ') || 'No hay servicios adicionales';
  }

  goBackToRooms(): void {
    this.router.navigate(['/rooms']);
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.calculatePaymentAmount();
      this.displayConfirmationModal = true;
    }
  }

  calculatePaymentAmount(): void {
    const total = this.calculateTotal();
    const paymentOption = this.reservationForm.get('paymentOption')?.value;
    this.paymentAmount = paymentOption === 'full' ? total : total * 0.5;
  }

  confirmPayment(): void {
    this.displayConfirmationModal = false;
    this.submitReservation();
    alert(
      `Pago de COP ${this.paymentAmount.toLocaleString(
        'es-CO'
      )} confirmado. ¡Reserva completada!`
    );
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        console.error('No authenticated user');
        return;
      }

      const reservationData = {
        habitacionId: this.roomId!,
        usuarioId: currentUser.id,
        fechaCheckin: this.formatDateForBackend(this.reservationForm.value.checkIn),
        fechaCheckout: this.formatDateForBackend(this.reservationForm.value.checkOut),
        total: this.calculateTotal()
      };

      this.reservationService.createReservation(reservationData).subscribe({
        next: (response) => {
          console.log('Reserva creada con éxito', response);
          this.displaySuccessModal = true;
        },
        error: (err) => {
          console.error('Error al crear la reserva', err);
        }
      });
    }
  }

  private formatDateForBackend(date: Date): string {
    return date.toISOString();
  }
}
