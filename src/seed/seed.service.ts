import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import axios, { AxiosInstance } from 'axios';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}
  
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