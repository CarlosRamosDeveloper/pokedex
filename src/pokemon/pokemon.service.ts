import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
      this.handleExceptions(error, "create")
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0  } = paginationDto;
    
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .select("-__v")
      .select("-_id");  
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

    try{
      await pokemon.updateOne( updatePokemonDto );

      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {      
      this.handleExceptions(error, "update")
    }    
  }

  async remove(id: string) {              
    const result = await this.pokemonModel.deleteOne({_id: id});
    console.log(`Pokemon with id ${id} has been exterminated`);
    if ( result.deletedCount === 0 ) {
      throw new BadRequestException(`Pokémon with id ${id} not found in Database`)
    }
    
    return "Pokémon obliterated from existence";
  }

  private handleExceptions (error: any, method: string) {
    const CREATE_ERROR: string = "Can't create this pokémon. - Check server logs for more info";
    const UPDATE_ERROR: string = "Can't update this pokémon. - Check server logs for more info";    
    let errorMessage: string;

    if (method === "create") {
      errorMessage = CREATE_ERROR;
    }
    if (method === "update") {
      errorMessage = UPDATE_ERROR;
    }

    if ( error.code === 11000 ) {      
      throw new BadRequestException(`Pokémon with name ${ JSON.stringify(error.keyValue)} exists in Database`);    
    }
    throw new InternalServerErrorException(errorMessage);
  }
}
