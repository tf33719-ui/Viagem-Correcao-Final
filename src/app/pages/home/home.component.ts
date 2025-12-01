import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  // --- LÓGICA DO PLANEJADOR DE ORÇAMENTO ---
  budget: number = 5000;
  selectedDestinationKey: string = 'roma';
  budgetResult: any = null;

  // Dados para cálculo
  destinationsData: any = {
    'tokyo': { name: 'Tóquio', dailyCost: 800, flight: 4500 },
    'maldivas': { name: 'Maldivas', dailyCost: 1500, flight: 6000 },
    'paris': { name: 'Paris', dailyCost: 700, flight: 3800 },
    'roma': { name: 'Roma', dailyCost: 650, flight: 3900 },
    'santorini': { name: 'Santorini', dailyCost: 900, flight: 4200 },
    'buenosaires': { name: 'Buenos Aires', dailyCost: 400, flight: 1800 },
    'cancun': { name: 'Cancún', dailyCost: 800, flight: 3500 },
    'zurique': { name: 'Zurique', dailyCost: 1200, flight: 4500 },
    'riodejaneiro': { name: 'Rio de Janeiro', dailyCost: 400, flight: 800 },
    'fernandodenoronha': { name: 'Noronha', dailyCost: 1000, flight: 2500 },
    'gramado': { name: 'Gramado', dailyCost: 500, flight: 1200 },
    'portodegalinhas': { name: 'Porto de Galinhas', dailyCost: 450, flight: 1300 },
    'maceio': { name: 'Maceió', dailyCost: 350, flight: 1100 },
    'portoseguro': { name: 'Porto Seguro', dailyCost: 400, flight: 1000 },
    'chapada': { name: 'Chapada Diamantina', dailyCost: 450, flight: 1400 },
    'jalapao': { name: 'Jalapão', dailyCost: 600, flight: 1600 }
  };

  calculateBudget() {
    const dest = this.destinationsData[this.selectedDestinationKey] || this.destinationsData['roma'];
    const days = 7; 
    const totalCost = dest.flight + (dest.dailyCost * days);
    const difference = this.budget - totalCost;

    this.budgetResult = {
      destination: dest.name,
      totalCost: totalCost,
      isPossible: difference >= 0,
      difference: Math.abs(difference)
    };
  }

  // --- LÓGICA DO POP-UP (MODAL) ---
  selectedDetail: any = null;
  activeImageIndex: number = 0;

  detailsDatabase: any = {
    'tokyo': { title: 'Tóquio, Japão', desc: 'Uma metrópole alucinante onde templos antigos encontram neons futuristas.', price: 'R$ 6.200', images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800'] },
    'maldivas': { title: 'Ilhas Maldivas', desc: 'O refúgio definitivo. Bangalôs sobre águas turquesas.', price: 'R$ 8.900', images: ['https://images.unsplash.com/photo-1577017040065-660a1ba8f37a?q=80&w=800', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800'] },
    'paris': { title: 'Paris, França', desc: 'A cidade luz espera por você com sua gastronomia e arte.', price: 'R$ 4.500', images: ['https://images.unsplash.com/photo-1502602898657-3e91760c0341?q=80&w=800', 'https://images.unsplash.com/photo-1499856871940-a09627c6d7db?q=80&w=800'] },
    'roma': { title: 'Roma, Itália', desc: 'Um museu a céu aberto. O Coliseu e o Vaticano te esperam.', price: 'R$ 4.800', images: ['https://images.unsplash.com/photo-1527856263669-1581a7b4556a?q=80&w=800', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800'] },
    'default': { title: 'Destino Incrível', desc: 'Prepare-se para viver dias inesquecíveis neste paraíso.', price: 'Consulte', images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800'] }
  };

  openModal(id: string) {
    this.selectedDetail = this.detailsDatabase[id] || { ...this.detailsDatabase['default'], title: id.toUpperCase() };
    this.activeImageIndex = 0;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedDetail = null;
    document.body.style.overflow = 'auto';
  }

  nextModalImage() {
    if (this.selectedDetail) {
      this.activeImageIndex = (this.activeImageIndex + 1) % this.selectedDetail.images.length;
    }
  }

  // --- LÓGICA DO MOTOR DO CARROSSEL (ATUALIZADO) ---
  @ViewChild('carouselInt') carouselInt!: ElementRef;
  @ViewChild('carouselNac') carouselNac!: ElementRef;

  isDown = false;
  startX = 0;
  scrollLeft = 0;
  animationIds: number[] = [];

  ngAfterViewInit() {
    // Inicia os motores
    this.startSmoothScroll(this.carouselInt.nativeElement);
    this.startSmoothScroll(this.carouselNac.nativeElement);
  }

  ngOnDestroy() {
    // Limpa a memória quando sai da página
    this.animationIds.forEach(id => cancelAnimationFrame(id));
  }

  // EVENTOS DE ARRASTAR (MOUSE)
  startDrag(e: MouseEvent, slider: HTMLElement) {
    this.isDown = true;
    slider.classList.add('active');
    this.startX = e.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }

  endDrag() {
    this.isDown = false;
  }

  moveDrag(e: MouseEvent, slider: HTMLElement) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - this.startX) * 2;
    slider.scrollLeft = this.scrollLeft - walk;
  }

  // --- NOVO MOTOR DE SCROLL (60 FPS - LISO) ---
  startSmoothScroll(slider: HTMLElement) {
    const speed = 0.5; // Ajuste a velocidade aqui (0.5 é suave, 1.0 é rápido)
    
    const animate = () => {
      // Se o usuário NÃO estiver arrastando, o site mexe sozinho
      if (!this.isDown) {
        // Verifica se chegou no fim (com margem de erro)
        if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth - 1)) {
          slider.scrollLeft = 0; // Volta para o início instantaneamente (Loop)
        } else {
          slider.scrollLeft += speed; // Move para frente
        }
      }
      // Chama o próximo frame (Loop da animação)
      const id = requestAnimationFrame(animate);
      this.animationIds.push(id);
    };

    // Começa a animação
    requestAnimationFrame(animate);
  }
}
