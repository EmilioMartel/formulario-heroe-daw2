import { Component } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Heroe } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: [
  ]
})
export class BuscarComponent {

  termino          : string = ''; //superheroe a buscar...
  heroes           : Heroe[] = []; 
  heroeSeleccionado: Heroe | undefined;

  constructor( private heroesService: HeroesService ) { }

  buscando() {
    this.heroesService.getSugerencias(this.termino.trim())
    .subscribe( heroes => this.heroes = heroes);
  }

  opcionSeleccionada( event: MatAutocompleteSelectedEvent ) {
    
    if(!event.option.value) { //si no tiene ningún valor
      this.heroeSeleccionado = undefined;
      return; //no hago nada 
    }
    
    const heroe: Heroe = event.option.value; //obtenemos el heroe seleccionado
    this.termino = heroe.superhero;
    
    this.heroesService.getHeroeById( heroe.id!)
      .subscribe( heroe => this.heroeSeleccionado = heroe);


    // manera más optima
    // this.heroeSeleccionado = heroe 

    /**
     * no hace falta filtrar por id ya que
     * el heroe escogido en las sugerencias
     * ya trae toda la información del objeto,
     * de esta forma nos ahorramos una consulta adicional
     */
    
  }

}
