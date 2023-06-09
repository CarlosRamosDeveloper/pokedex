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
    await this.pokemonModel.deleteMany({});

    const POKEMON_LIMIT:number = 50;
    const POKEAPI_URL:string = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`;
    const {data} = await this.axios.get<PokeResponse>(POKEAPI_URL);
    const SUCCESS_MESSAGE = "Seed Executed";
    const POKEMON_TO_INSERT: { name: string, no: number}[] = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split("/");
      const no: number = +segments [ segments.length -2]

      POKEMON_TO_INSERT.push({name, no});
    });
    await this.pokemonModel.insertMany(POKEMON_TO_INSERT);

    console.log("Data generated");

    return SUCCESS_MESSAGE;
  }
}