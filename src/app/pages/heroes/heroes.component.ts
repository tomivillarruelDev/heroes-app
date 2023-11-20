import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { HeroModel } from 'src/app/models/heroe.model';
import { HeroesService } from 'src/app/services/heroes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroModel[] = [];

  loading: boolean = false;

  constructor( private heroesService: HeroesService ) { }

  async ngOnInit(): Promise<void> {

    this.loading = true;
    const resp = await this.heroesService.getHeroes();
    this.heroes = resp;
    this.loading = false;
  }

  public async deleteHeroe( heroe: HeroModel, i: number ): Promise<void> {

    const response = await Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ heroe.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    });
    if(response.value){
      this.heroes = this.heroes.filter( heroItem => heroItem.id !== heroe.id );
      await this.heroesService.deleteHeroe( heroe.id! );
      
    }
  }

}
