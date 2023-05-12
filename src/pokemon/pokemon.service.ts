import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      
      return pokemon;
    } catch (error) {
      console.log(error)
      if ( error.code === 11000 ) {
        throw new BadRequestException(`Pokémon with name ${ JSON.stringify(error.keyValue)} exists in Database`);
      }
      throw new InternalServerErrorException(`Can't create Pokémon. - Check server logs`);
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if ( !isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim()});
    }

    if (!pokemon) throw new NotFoundException(`Pokémon not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term);

    if ( updatePokemonDto.name ) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    await pokemon.updateOne( updatePokemonDto );
    
    return {...pokemon.toJSON(), ...updatePokemonDto};
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
