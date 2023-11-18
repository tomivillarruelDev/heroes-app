import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url: string = 'https://heroesapp-677bb-default-rtdb.firebaseio.com';

  constructor( private http: HttpClient ) { }

  public async createHeroe( heroe: HeroeModel ): Promise<HeroeModel> {

    const resp = await firstValueFrom( this.http.post<HeroeModel>(`${ this.url }/heroes.json`, heroe) );
    return resp;

  }

  public async updateHeroe( heroe: HeroeModel ): Promise<HeroeModel> {

  
    const { id: _, ...heroeTemp } = heroe;

    const resp = await firstValueFrom( this.http.put<HeroeModel>(`${ this.url }/heroes/${ heroe.id }.json`, heroeTemp ) )
    return resp;
  }

  public async deleteHeroe( id: string ): Promise<void> {

    const resp = await firstValueFrom( this.http.delete<void>(`${ this.url }/heroes/${ id }.json`) );
    return resp;
  }

  public async getHeroe ( id: string ): Promise<HeroeModel> {

    const resp = await firstValueFrom( this.http.get<HeroeModel>(`${ this.url }/heroes/${ id }.json`) );
    return resp;
  }

  public async getHeroes(): Promise<HeroeModel[]> {

    const resp: { [ key: string]: HeroeModel } = await firstValueFrom ( this.http.get<{ [key: string ]: HeroeModel }>(`${ this.url }/heroes.json`) )
    return this.createArray( resp );
  }
 
  private createArray( heroesObj: { [key: string ]: HeroeModel }) : HeroeModel[] {
    const heroes: HeroeModel[] = [];

    if( !heroesObj ) { return []; }

    Object.entries( heroesObj ).forEach( ([key, value]) => {
      const heroe: HeroeModel = value;
      heroe.id = key;
      heroes.push( heroe );
    });

    return heroes;
  }
}
