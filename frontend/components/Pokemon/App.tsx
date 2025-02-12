import React, { useState } from "react";
import { PokemonSummary, PokemonApiResponse } from "../../lib/models";
import { PokemonList } from "./List";
import { ServerSuspense } from "../ServerSuspense";
import Loading from "../Loading";

interface PokemonsProps extends PokemonApiResponse {
	selectedPokemon: string | null;
}

export function Pokemons(props: PokemonsProps) {
	const [selectedPokemon, setSelectedPokemon] = useState<string | null>(
		props.selectedPokemon,
	);

	const handlePokemonClick = async (pokemon: PokemonSummary) => {
		setSelectedPokemon(pokemon.name);
		window.history.pushState(null, "", `/pokemon/${pokemon.name}`);
	};

	return (
		<div className="welcome-container">
			{!selectedPokemon && (
				<h1 className="welcome-title">List of all pokemon</h1>
			)}
			{selectedPokemon && (
				<div>
					<ServerSuspense
						fallback={<Loading />}
						errorFallback={<p>Error loading pokemon detail</p>}
						componentPath="Pokemon/Detail"
						name={selectedPokemon}
					/>
				</div>
			)}
			{!selectedPokemon && (
				<PokemonList {...props} onPokemonClick={handlePokemonClick} />
			)}
		</div>
	);
}
