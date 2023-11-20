import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HeroModel } from 'src/app/models/hero.model';
import { HeroesService } from 'src/app/services/heroes.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html'
})
export class HeroComponent implements OnInit {

  form!: FormGroup;

  hero = new HeroModel();

  constructor(  private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private heroesService: HeroesService ) {}

  async ngOnInit(): Promise<void> {

    const id: string = this.activatedRoute.snapshot.paramMap.get('id')!;

    if ( id !== 'new' ){
      await this.getHero(id);
    }

    this.createForm();
  }

  public async save(): Promise<void> {
    console.log('heroe', this.hero);
    if (this.form.invalid){
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, llene todos los campos',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let request: Promise<void>;

    if ( this.hero.id ){
      request =  this.updateHero(this.hero);
      
    } else {
      request =  this.postHero(this.hero);
    }  

    try {
      await request;
      Swal.fire({
        title: this.hero.name,
        text: 'Se actualizó correctamente',
        icon: 'success'
      });
      this.router.navigateByUrl('/heros');
    } catch (error) {
      Swal.fire({
        title: this.hero.name,
        text: 'No se pudo actualizar',
        icon: 'error'
      });
    }


  }

  private async getHero ( id: string ): Promise<void> {
      
      try {
        const resp: HeroModel = await this.heroesService.getHero(id);
        this.hero = resp;
        this.hero.id = id;
        console.log('salio todo bien el get',this.hero);
      } catch (error) {
        console.log('get error', error);
      }
    
  }

  private async updateHero( hero: HeroModel): Promise<void> {

    try {
      console.log('update hero');
      const resp = await this.heroesService.updateHero(hero);
    } catch (error) {
      console.log(error);
    }
  }

  private async postHero( hero: HeroModel ): Promise<void> {

    try {
      console.log('datos hero post ', hero);
      const resp = await this.heroesService.createHero(hero);
      this.hero.id = resp.name;
      this.form.get('id')?.setValue(this.hero.id);
    } catch (error) {
      console.log(error);
    }
  }

  private createForm(): void{

  
    this.form = this.fb.group({
      id: [ this.hero.id, Validators.required  ],
      name: [this.hero.name, [ Validators.required, Validators.minLength(3) ]],
      power: [this.hero.power],
      status: [this.hero.status]
    });
    this.form.get('id')?.disable();
    this.form.valueChanges.subscribe( (data: HeroModel) => {

      if ( this.hero.id ){
        data = {...data, id: this.hero.id};
        console.log('data if', data);
      }
      this.hero = data;
    });
  
  }

}
