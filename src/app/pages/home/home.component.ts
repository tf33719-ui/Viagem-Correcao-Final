import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  // --- LÓGICA DO PLANEJADOR DE ORÇAMENTO ---
  budget: number = 5000;
  selectedDestinationKey: string = 'roma';
  budgetResult: any = null;

  // Dados para cálculo (Custo Diário Estimado + Passagem Média)
  destinationsData: any = {
    'tokyo': { name: 'Tóquio', dailyCost: 800, flight: 4500, label: 'Tóquio, Japão' },
    'maldivas': { name: 'Maldivas', dailyCost: 1500, flight: 6000, label: 'Maldivas' },
    'paris': { name: 'Paris', dailyCost: 700, flight: 3800, label: 'Paris, França' },
    'roma': { name: 'Roma', dailyCost: 650, flight: 3900, label: 'Roma, Itália' },
    'santorini': { name: 'Santorini', dailyCost: 900, flight: 4200, label: 'Santorini, Grécia' },
    'buenosaires': { name: 'Buenos Aires', dailyCost: 400, flight: 1800, label: 'Buenos Aires, Arg' },
    'cancun': { name: 'Cancún', dailyCost: 800, flight: 3500, label: 'Cancún, México' },
    'zurique': { name: 'Zurique', dailyCost: 1200, flight: 4500, label: 'Zurique, Suíça' },
    'riodejaneiro': { name: 'Rio de Janeiro', dailyCost: 400, flight: 800, label: 'Rio de Janeiro' },
    'fernandodenoronha': { name: 'Noronha', dailyCost: 1000, flight: 2500, label: 'Fernando de Noronha' },
    'gramado': { name: 'Gramado', dailyCost: 500, flight: 1200, label: 'Gramado' },
    'portodegalinhas': { name: 'Porto de Galinhas', dailyCost: 450, flight: 1300, label: 'Porto de Galinhas' },
    'maceio': { name: 'Maceió', dailyCost: 350, flight: 1100, label: 'Maceió' }
  };

  calculateBudget() {
    const dest = this.destinationsData[this.selectedDestinationKey];
    const days = 7; // Média de 7 dias
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

  // Banco de dados dos detalhes (Imagens e Textos)
  detailsDatabase: any = {
    'tokyo': {
      title: 'Tóquio, Japão',
      desc: 'Uma metrópole alucinante onde templos antigos encontram neons futuristas. Experimente o melhor sushi do mundo e a cultura pop de Akihabara.',
      price: 'R$ 6.200',
      images: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
        'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800'
      ]
    },
    'maldivas': {
      title: 'Ilhas Maldivas',
      desc: 'O refúgio definitivo. Bangalôs sobre águas turquesas, vida marinha vibrante e luxo descalço.',
      price: 'R$ 8.900',
      images: [
        'https://images.unsplash.com/photo-1577017040065-660a1ba8f37a?q=80&w=800',
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800',
        'https://images.unsplash.com/photo-1605537964076-3cb0ea2e355d?q=80&w=800'
      ]
    },
    // Adicionei um genérico para os outros funcionarem na hora
    'default': {
      title: 'Destino Incrível',
      desc: 'Prepare-se para viver dias inesquecíveis neste paraíso. Cultura, gastronomia e paisagens de tirar o fôlego esperam por você.',
      price: 'Consulte',
      images: [
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'
      ]
    }
  };

  openModal(id: string) {
    this.selectedDetail = this.detailsDatabase[id] || { ...this.detailsDatabase['default'], title: id.toUpperCase() };
    this.activeImageIndex = 0;
    // Trava a rolagem do fundo
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

  // --- LÓGICA DO ARRASTAR (DRAG) & LOOP ---
  @ViewChild('carouselInt') carouselInt!: ElementRef;
  @ViewChild('carouselNac') carouselNac!: ElementRef;

  isDown = false;
  startX = 0;
  scrollLeft = 0;

  ngAfterViewInit() {
    // Inicia o Loop Automático
    this.startAutoScroll(this.carouselInt.nativeElement);
    this.startAutoScroll(this.carouselNac.nativeElement);
  }

  // Função para Arrastar com o Mouse
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
    const walk = (x - this.startX) * 2; // Velocidade do arraste
    slider.scrollLeft = this.scrollLeft - walk;
  }

  // Loop Automático Suave
  startAutoScroll(slider: HTMLElement) {
    setInterval(() => {
      if (!this.isDown) { // Só roda se não estiver arrastando
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          slider.scrollLeft += 1; // Velocidade do loop (aumente para ir mais rápido)
        }
      }
    }, 20); // 20ms = 50fps
  }
}
