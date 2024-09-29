import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  providers: [MessageService],
  template: `
  <p-toast></p-toast> 
    <div class="contact-form">
      <h2>Contactez-nous</h2>
      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" pInputText class="input-text"/>
          <small *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" class="error">
            L'email est requis et doit être valide.
          </small>
        </div>
        <div class="form-field">
          <label for="message">Message</label>
          <textarea id="message" formControlName="message" rows="5" pInputTextarea class="input-textarea"></textarea>
          <small *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" class="error">
            Le message est requis et doit contenir moins de 300 caractères.
          </small>
        </div>
        <button type="submit" pButton label="Envoyer" class="submit-button" [disabled]="contactForm.invalid"></button>
      </form>
    </div>
  `,
  styles: [`
    .contact-form {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .contact-form:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.8rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.5rem;
    }

    label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #555;
    }

    .input-text, .input-textarea {
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      transition: border-color 0.3s ease;
    }

    .input-text:focus, .input-textarea:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .submit-button {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      background-color: #007bff;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .submit-button:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    .submit-button:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }

    .error {
      color: red;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `],
})
export class contactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Demande de contact envoyée avec succès',
      });
      this.contactForm.reset();
    }
  }
}
