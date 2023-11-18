import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { HeroeModel } from 'src/app/models/heroe.model';
import { HeroesService } from 'src/app/services/heroes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = [];

  loading: boolean = false;

  constructor( private heroesService: HeroesService ) { }

  async ngOnInit(): Promise<void> {

    this.loading = true;
    const resp = await this.heroesService.getHeroes();
    this.heroes = resp;
    this.loading = false;
  }

  public async deleteHeroe( heroe: HeroeModel, i: number ): Promise<void> {
      
      Swal.fire({
        title: '¿Está seguro?',
        text: `Está seguro que desea borrar a ${ heroe.name }`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then( async resp => { 
        if ( resp.value ) { 
          this.heroes.splice(i, 1);
          await this.heroesService.deleteHeroe( heroe.id! );
        }
      });
  }

}
