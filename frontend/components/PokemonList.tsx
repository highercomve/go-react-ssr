import React from "react";
import { PokemonApiResponse, PokemonSummary } from "../lib/models";

interface PokemonListProps extends PokemonApiResponse {
	onPokemonClick: (pokemon: PokemonSummary) => void;
}

PokemonList.$$typeof = Symbol.for('react.client.component');

export function PokemonList(props: PokemonListProps) {
	const { results } = props;

	return (
		<div className="pokemon-list">
			{results.map((pokemon, index) => (
				<div
					key={index}
					className="pokemon-item"
					style={{ cursor: "pointer" }}
					onClick={() => props.onPokemonClick(pokemon)}
				>
					<img
						src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
						alt={pokemon.name}
						className="pokemon-image"
					/>
					<p>{pokemon.name}</p>
				</div>
			))}
		</div>
	);
}
