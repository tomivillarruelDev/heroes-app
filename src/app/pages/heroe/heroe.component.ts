import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HeroModel } from 'src/app/models/heroe.model';
import { HeroesService } from 'src/app/services/heroes.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent implements OnInit {

  form!: FormGroup;

  heroe = new HeroModel();

  constructor(  private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private heroeService: HeroesService ) {}

  async ngOnInit(): Promise<void> {

    const id: string = this.activatedRoute.snapshot.paramMap.get('id')!;

    if ( id !== 'new' ){
      await this.getHeroe(id);
    }

    this.createForm();
  }

  public async save(): Promise<void> {
    console.log('heroe', this.heroe);
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

    if ( this.heroe.id ){
      request =  this.updateHeroe(this.heroe);
      
    } else {
      request =  this.postHeroe(this.heroe);
    }  

    try {
      await request;
      Swal.fire({
        title: this.heroe.name,
        text: 'Se actualizó correctamente',
        icon: 'success'
      });
      this.router.navigateByUrl('/heroes');
    } catch (error) {
      Swal.fire({
        title: this.heroe.name,
        text: 'No se pudo actualizar',
        icon: 'error'
      });
    }


  }

  private async getHeroe ( id: string ): Promise<void> {
      
      try {
        const resp: HeroModel = await this.heroeService.getHeroe(id);
        this.heroe = resp;
        this.heroe.id = id;
        console.log('salio todo bien el get',this.heroe);
      } catch (error) {
        console.log('get error', error);
      }
    
  }

  private async updateHeroe( heroe: HeroModel): Promise<void> {

    try {
      console.log('update heroe');
      const resp = await this.heroeService.updateHeroe(heroe);
    } catch (error) {
      console.log(error);
    }
  }

  private async postHeroe( heroe: HeroModel ): Promise<void> {

    try {
      console.log('datos heroe post ', heroe);
      const resp = await this.heroeService.createHero(heroe);
      this.heroe.id = resp.name;
      this.form.get('id')?.setValue(this.heroe.id);
    } catch (error) {
      console.log(error);
    }
  }

  private createForm(): void{

  
    this.form = this.fb.group({
      id: [ this.heroe.id, Validators.required  ],
      name: [this.heroe.name, [ Validators.required, Validators.minLength(3) ]],
      power: [this.heroe.power],
      status: [this.heroe.status]
    });
    this.form.get('id')?.disable();
    this.form.valueChanges.subscribe( (data: HeroModel) => {

      if ( this.heroe.id ){
        data = {...data, id: this.heroe.id};
        console.log('data if', data);
      }
      this.heroe = data;
    });
  
  }

}
