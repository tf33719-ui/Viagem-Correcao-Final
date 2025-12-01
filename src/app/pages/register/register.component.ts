import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styles: [`
    .register-container { 
      max-width: 450px; 
      margin: 50px auto; 
      padding: 30px; 
      border: 1px solid #836FFF; 
      border-radius: 12px; 
      text-align: center; 
      font-family: 'Segoe UI', sans-serif;
      background-color: #0f172a; /* Fundo escuro */
      color: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    h2 { color: #836FFF; margin-bottom: 10px; }
    input { 
      width: 90%; 
      padding: 12px; 
      margin: 10px 0; 
      border: 1px solid #334155; 
      border-radius: 8px; 
      background-color: #1e293b; 
      color: white;
    }
    input:focus { outline: 2px solid #836FFF; }
    button { 
      width: 96%; 
      padding: 12px; 
      background-color: #836FFF; 
      color: #0f172a; 
      font-weight: bold;
      border: none; 
      border-radius: 8px; 
      cursor: pointer; 
      font-size: 16px; 
      margin-top: 15px;
      transition: transform 0.2s;
    }
    button:hover { background-color: #6d5ce8; transform: scale(1.02); }
    a { color: #836FFF; text-decoration: none; font-weight: bold; }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  onRegister() {
    // Validação simples
    if(this.name && this.email && this.password) {
      if(this.password !== this.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      
      // Simulação de cadastro bem-sucedido
      alert('Conta criada com sucesso! Bem-vindo(a) à Travel Dreams.');
      this.router.navigate(['/home']);
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
}
