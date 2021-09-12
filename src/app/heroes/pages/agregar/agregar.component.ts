import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HeroesService } from '../../services/heroes.service';
import { Publisher, Heroe } from '../../interfaces/heroes.interface';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';



@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  `]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: "DC - Comics"
    },
    {
      id: 'Marvel Comics',
      desc: "Marvel - Comics"
    }
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.MarvelComics,
    alt_img: ''
  }

  constructor( private heroeService: HeroesService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private snackBar: MatSnackBar,
               private dialog: MatDialog) { }

  ngOnInit(): void {

    if(!this.router.url.includes('editar')){
      return;
    }   

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroeService.getHeroeById(id) )
      )
      .subscribe( heroe => this.heroe = heroe);
  }

  guardar(){
    //campos obligatorios
    if( this.heroe.superhero.trim().length === 0 ||
        this.heroe.alter_ego.trim().length === 0 ||
        this.heroe.first_appearance.trim().length === 0 ||
        this.heroe.characters.trim().length === 0 ||
        this.heroe.alt_img?.trim().length === 0 ) {
      return;
    }
    
    if( this.heroe.id ) {
      //Actualizar
      this.heroeService.actualizarHeroe(this.heroe)
        .subscribe( () => this.mostrarSnackBar( 'Registro actualizdo' ));
    }else {
      //Agregar
      this.heroeService.agregarHeroe(this.heroe)
        .subscribe( heroe => {
         this.router.navigate(['/heroes/editar', heroe.id])
         this.mostrarSnackBar( 'Registro creado' );
          
        });
    }
  }

  borrarHeroe(){

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: 'auto',
      data: { ...this.heroe }
    });

    dialog.afterClosed()
      .subscribe( (result) => {
      if( result ) {
        this.heroeService.borrarHeroe(this.heroe.id!)
          .subscribe( () => {
            this.router.navigate(['/heroes'])
          });
      }
    })
  }

  mostrarSnackBar ( mensaje: string ): void {
    this.snackBar.open( mensaje, 'Ok!', {
      duration: 2500
    });
  }

}

