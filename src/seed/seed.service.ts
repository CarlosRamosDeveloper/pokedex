import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  
  async executeSeed(){
    console.log("Gathering data");    
    const pokemonLimit:number = 10;
    const POKEAPI_URL:string = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}`;
    const {data} = await this.axios.get<PokeResponse>(POKEAPI_URL);

    data.results.forEach( ({name, url}) => {
      const segments = url.split("/");
      let no: number = +segments [ segments.length -2]

      console.log(`${no}: ${name}`);
    });
    console.log("Seed executed");

    return data.results;
  }
}