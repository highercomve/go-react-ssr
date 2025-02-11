import React, { useState } from "react";
import { PokemonSummary, PokemonApiResponse } from "../lib/models";
import { PokemonList } from "./PokemonList";
import { ServerSuspense } from "./ServerSuspense";
import Loading from "./Loading";

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

	const closeModal = (e) => {
		e.preventDefault(); // Prevent default link navigation

		window.history.pushState(null, "", `/pokemon`);
		setSelectedPokemon(null);
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
						componentPath="PokemonDetail.js"
						onClick={closeModal}
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
