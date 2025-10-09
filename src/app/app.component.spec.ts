import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

// Grupo de pruebas para AppComponent
describe('AppComponent', () => {
  
  // Antes de cada prueba, configura el módulo de test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // importa el componente que se va a probar
    }).compileComponents();
  });

  // Prueba 1: comprobar que el componente se crea correctamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // el componente debe existir
  });

  // Prueba 2: verificar que la propiedad "title" tenga el valor esperado
  it(`should have the 'registro-ventas' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('registro-ventas'); // compara el título
  });

  // Prueba 3: comprobar que el título se renderiza en el HTML
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // detecta cambios en la vista
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent)
      .toContain('Hello, registro-ventas'); // busca el título en pantalla
  });
});
