import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { HeroModel } from 'src/app/models/hero.model';
import { HeroesService } from 'src/app/services/heroes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html'
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

  public async deleteHero( hero: HeroModel, i: number ): Promise<void> {

    const response = await Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ hero.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    });
    if(response.value){
      this.heroes = this.heroes.filter( heroItem => heroItem.id !== hero.id );
      await this.heroesService.deleteHero( hero.id! );
      
    }
  }

}
