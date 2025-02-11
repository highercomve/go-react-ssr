import React, { useState } from "react";
import { PokemonApiResponse, Pokemon, PokemonSummary } from "../lib/models";
import { PokemonDetail } from "./PokemonDetail";

async function fetchPokemonDetail(name: string): Promise<Pokemon> {
	try {
		const response = await fetch(`/pokemon/${name}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: Pokemon = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to fetch Pokemon detail:", error);
		throw error;
	}
}

export function PokemonList(props: PokemonApiResponse) {
	const { count, next, previous, results } = props;
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(
		null,
	);
	const [loading, setLoading] = useState(false);

	const handlePokemonClick = async (pokemon: PokemonSummary) => {
		setLoading(true);
		const pokemonDetail = await fetchPokemonDetail(pokemon.name);
		setSelectedPokemon(pokemonDetail);
		setLoading(false);
		window.history.pushState(null, "", `/pokemon/${pokemon.name}`);
	};

	const closeModal = () => {
		setSelectedPokemon(null);
		window.history.pushState(null, "", `/pokemon`);
	};

	return (
		<div className="welcome-container">
			{!selectedPokemon && (
				<h1 className="welcome-title">List of all pokemon</h1>
			)}
			{selectedPokemon && (
				<div className="pokemon-detail-container">
					<button className="back-button" onClick={closeModal}>
						Back
					</button>
					<PokemonDetail pokemon={selectedPokemon} />
				</div>
			)}
			{loading && <p>Loading...</p>}
			{!selectedPokemon && !loading && (
				<div className="pokemon-list">
					{results.map((pokemon, index) => (
						<div
							key={index}
							className="pokemon-item"
							style={{ cursor: "pointer" }}
							onClick={() => handlePokemonClick(pokemon)}
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
			)}
		</div>
	);
}
