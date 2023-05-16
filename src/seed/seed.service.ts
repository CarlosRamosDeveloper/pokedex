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

    console.log("Gathering data");    
    const pokemonLimit:number = 100;
    const POKEAPI_URL:string = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}`;
    const {data} = await this.axios.get<PokeResponse>(POKEAPI_URL);
    const SUCCESS_MESSAGE = "Seed Executed";
    const insertPromisesArray = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split("/");
      const no: number = +segments [ segments.length -2]

      insertPromisesArray.push(
        this.pokemonModel.create({name, no})
      );
    });
    await Promise.all(insertPromisesArray);

    console.log(SUCCESS_MESSAGE);

    return SUCCESS_MESSAGE;
  }
}