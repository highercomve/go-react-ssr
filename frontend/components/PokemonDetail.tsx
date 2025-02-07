import React from "react";
import { Pokemon } from "../lib/models";

export function PokemonDetail({ pokemon }: { pokemon: Pokemon }) {
	if (!pokemon) {
		return <div>No Pokémon data available</div>;
	}

	return (
		<div className="pokemon-detail-card">
			<div className="card-header">
				<h1 className="pokemon-name">{pokemon.name}</h1>
				<p className="pokemon-id">ID: {pokemon.id}</p>
				<img
					src={pokemon.sprites.front_default}
					alt={`${pokemon.name} image`}
					className="pokemon-image"
				/>
			</div>
			<div className="card-body">
				<div className="pokemon-info">
					<p>Height: {pokemon.height / 10} m</p>
					<p>Weight: {pokemon.weight / 10} kg</p>
					<p>Base Experience: {pokemon.base_experience}</p>
					<p>Order: {pokemon.order}</p>
					<p>Is Default: {pokemon.is_default ? "Yes" : "No"}</p>
				</div>

				<div className="pokemon-section">
					<h2>Abilities</h2>
					<ul>
						{pokemon.abilities.map((ability, index) => (
							<li key={index}>
								{ability.ability.name} (Hidden:{" "}
								{ability.is_hidden ? "Yes" : "No"}, Slot:{" "}
								{ability.slot})
							</li>
						))}
					</ul>
				</div>

				<div className="pokemon-section">
					<h2>Types</h2>
					<ul>
						{pokemon.types.map((type, index) => (
							<li key={index}>
								{type.type.name} (Slot: {type.slot})
							</li>
						))}
					</ul>
				</div>

				<div className="pokemon-section">
					<h2>Stats</h2>
					<ul>
						{pokemon.stats.map((stat, index) => (
							<li key={index}>
								{stat.stat.name}: {stat.base_stat} (Effort:{" "}
								{stat.effort})
							</li>
						))}
					</ul>
				</div>

				<div className="pokemon-section">
					<h2>Moves</h2>
					<ul>
						{pokemon.moves.map((move, index) => (
							<li key={index}>{move.move.name}</li>
						))}
					</ul>
				</div>

				<div className="pokemon-section">
					<h2>Sprites</h2>
					<div className="sprites">
						<img
							src={pokemon.sprites.front_default}
							alt={`${pokemon.name} front`}
						/>
						<img
							src={pokemon.sprites.back_default}
							alt={`${pokemon.name} back`}
						/>
						{pokemon.sprites.front_female && (
							<img
								src={pokemon.sprites.front_female}
								alt={`${pokemon.name} front female`}
							/>
						)}
						{pokemon.sprites.back_female && (
							<img
								src={pokemon.sprites.back_female}
								alt={`${pokemon.name} back female`}
							/>
						)}
						<img
							src={pokemon.sprites.front_shiny}
							alt={`${pokemon.name} front shiny`}
						/>
						<img
							src={pokemon.sprites.back_shiny}
							alt={`${pokemon.name} back shiny`}
						/>
						{pokemon.sprites.front_shiny_female && (
							<img
								src={pokemon.sprites.front_shiny_female}
								alt={`${pokemon.name} front shiny female`}
							/>
						)}
						{pokemon.sprites.back_shiny_female && (
							<img
								src={pokemon.sprites.back_shiny_female}
								alt={`${pokemon.name} back shiny female`}
							/>
						)}
					</div>
				</div>

				<div className="pokemon-section">
					<h2>Held Items</h2>
					<ul>
						{pokemon.held_items.map((heldItem, index) => (
							<li key={index}>
								{heldItem.item.name}
								<ul>
									{heldItem.version_details.map(
										(versionDetail, idx) => (
											<li key={idx}>
												Version:{" "}
												{versionDetail.version.name},
												Rarity: {versionDetail.rarity}
											</li>
										),
									)}
								</ul>
							</li>
						))}
					</ul>
				</div>

				<div className="pokemon-section">
					<h2>Forms</h2>
					<ul>
						{pokemon.forms.map((form, index) => (
							<li key={index}>{form.name}</li>
						))}
					</ul>
				</div>

				<div className="pokemon-section">
					<h2>Game Indices</h2>
					<ul>
						{pokemon.game_indices.map((gameIndex, index) => (
							<li key={index}>
								Game Index: {gameIndex.game_index}, Version:{" "}
								{gameIndex.version.name}
							</li>
						))}
					</ul>
				</div>

				<div className="pokemon-section">
					<p>
						Location Area Encounters:{" "}
						{pokemon.location_area_encounters}
					</p>
				</div>

				<div className="pokemon-section">
					<h2>Species</h2>
					<p>{pokemon.species.name}</p>
				</div>

				<div className="pokemon-section">
					<h2>Cries</h2>
					<p>Latest: {pokemon.cries.latest}</p>
					<p>Legacy: {pokemon.cries.legacy}</p>
				</div>
			</div>
		</div>
	);
}
