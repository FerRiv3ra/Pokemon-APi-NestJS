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
      this.handleException(error);
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

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (!!updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (!deletedCount) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    return;
  }

  private handleException(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon with '${Object.keys(error.keyValue)[0]}: ${
          error.keyValue[Object.keys(error.keyValue)[0]]
        }' already exists`,
      );
    }

    throw new InternalServerErrorException('Pokemon not created - Check logs');
  }
}
