import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroModel } from '../models/heroe.model';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url: string = 'https://heroesapp-677bb-default-rtdb.firebaseio.com';

  constructor( private http: HttpClient ) { }

  public async createHero( hero: HeroModel ): Promise<HeroModel> {

    const resp = await firstValueFrom( this.http.post<HeroModel>(`${ this.url }/heroes.json`, hero) );
    return resp;

  }

  public async updateHeroe( heroe: HeroModel ): Promise<HeroModel> {

  
    const { id: _, ...heroeTemp } = heroe;

    const resp = await firstValueFrom( this.http.put<HeroModel>(`${ this.url }/heroes/${ heroe.id }.json`, heroeTemp ) )
    return resp;
  }

  public async deleteHeroe( id: string ): Promise<void> {

    const resp = await firstValueFrom( this.http.delete<void>(`${ this.url }/heroes/${ id }.json`) );
    return resp;
  }

  public async getHeroe ( id: string ): Promise<HeroModel> {

    const resp = await firstValueFrom( this.http.get<HeroModel>(`${ this.url }/heroes/${ id }.json`) );
    return resp;
  }

  public async getHeroes(): Promise<HeroModel[]> {

    const resp: { [ key: string]: HeroModel } = await firstValueFrom ( this.http.get<{ [key: string ]: HeroModel }>(`${ this.url }/heroes.json`) )
    return this.createArray( resp );
  }
 
  private createArray( heroesObj: { [key: string ]: HeroModel }) : HeroModel[] {

    if( !heroesObj ) { return []; }

    const heroes = Object.entries( heroesObj ).map( ( [key, value]) => {
      const hero: HeroModel = value;
      hero.id = key;
      return hero

    });

    return heroes;
  }
}
