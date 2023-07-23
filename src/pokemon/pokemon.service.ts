import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Pokemon already exists');
      }

      console.log(error);
      throw new InternalServerErrorException(
        'Pokemon not created - Check logs',
      );
    }
  }

  async findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // By number
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ noPokemon: term });
    }

    // By ID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // By name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    // Not found
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with ID, Number or name '${term}' not found`,
      );

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
