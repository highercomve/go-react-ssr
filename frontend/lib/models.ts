export interface PokemonApiResponse {
	count: number;
	next?: string;
	previous?: string;
	results: PokemonSummary[];
}

export interface PokemonSummary {
	name: string;
	url: string;
}

export interface Pokemon {
	abilities: PokemonAbility[];
	base_experience: number;
	cries: Cry;
	forms: Form[];
	game_indices: GameIndex[];
	height: number;
	held_items: HeldItem[];
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: PokemonMove[];
	name: string;
	order: number;
	past_abilities: any[];
	past_types: any[];
	species: Species;
	sprites: Sprites;
	stats: PokemonStat[];
	types: PokemonType[];
	weight: number;
}

export interface Ability {
	name: string;
	url: string;
}

export interface PokemonAbility {
	ability: Ability;
	is_hidden: boolean;
	slot: number;
}

export interface Cry {
	latest: string;
	legacy: string;
}

export interface Form {
	name: string;
	url: string;
}

export interface Version {
	name: string;
	url: string;
}

export interface GameIndex {
	game_index: number;
	version: Version;
}

export interface Item {
	name: string;
	url: string;
}

export interface VersionDetail {
	rarity: number;
	version: Version;
}

export interface HeldItem {
	item: Item;
	version_details: VersionDetail[];
}

export interface Move {
	name: string;
	url: string;
}

export interface MoveLearnMethod {
	name: string;
	url: string;
}

export interface VersionGroup {
	name: string;
	url: string;
}

export interface VersionGroupDetail {
	level_learned_at: number;
	move_learn_method: MoveLearnMethod;
	version_group: VersionGroup;
}

export interface PokemonMove {
	move: Move;
	version_group_details: VersionGroupDetail[];
}

export interface Species {
	name: string;
	url: string;
}

export interface Sprite {
	back_default: string;
	back_female?: string;
	back_shiny: string;
	back_shiny_female?: string;
	front_default: string;
	front_female?: string;
	front_shiny: string;
	front_shiny_female?: string;
}

export interface OtherSprites {
	dream_world: Sprite;
	home: Sprite;
	official_artwork: Sprite;
	showdown: Sprite;
}

export interface VersionSprites {
	generation_i: { [key: string]: Sprite };
	generation_ii: { [key: string]: Sprite };
	generation_iii: { [key: string]: Sprite };
	generation_iv: { [key: string]: Sprite };
	generation_v: { [key: string]: Sprite };
	generation_vi: { [key: string]: Sprite };
	generation_vii: { [key: string]: Sprite };
	generation_viii: { [key: string]: Sprite };
}

export interface Sprites {
	back_default: string;
	back_female?: string;
	back_shiny: string;
	back_shiny_female?: string;
	front_default: string;
	front_female?: string;
	front_shiny: string;
	front_shiny_female?: string;
	other: OtherSprites;
	versions: VersionSprites;
}

export interface Stat {
	name: string;
	url: string;
}

export interface PokemonStat {
	base_stat: number;
	effort: number;
	stat: Stat;
}

export interface Type {
	name: string;
	url: string;
}

export interface PokemonType {
	slot: number;
	type: Type;
}
