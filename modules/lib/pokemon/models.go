package pokemon

type PokemonApiResponse struct {
	Count    int              `json:"count"`
	Next     *string          `json:"next"`
	Previous *string          `json:"previous"`
	Results  []PokemonSummary `json:"results"`
}

type PokemonSummary struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type Pokemon struct {
	Abilities              []PokemonAbility `json:"abilities"`
	BaseExperience         int              `json:"base_experience"`
	Cries                  Cry              `json:"cries"`
	Forms                  []Form           `json:"forms"`
	GameIndices            []GameIndex      `json:"game_indices"`
	Height                 int              `json:"height"`
	HeldItems              []HeldItem       `json:"held_items"`
	ID                     int              `json:"id"`
	IsDefault              bool             `json:"is_default"`
	LocationAreaEncounters string           `json:"location_area_encounters"`
	Moves                  []PokemonMove    `json:"moves"`
	Name                   string           `json:"name"`
	Order                  int              `json:"order"`
	PastAbilities          []interface{}    `json:"past_abilities"`
	PastTypes              []interface{}    `json:"past_types"`
	Species                Species          `json:"species"`
	Sprites                Sprites          `json:"sprites"`
	Stats                  []PokemonStat    `json:"stats"`
	Types                  []PokemonType    `json:"types"`
	Weight                 int              `json:"weight"`
}

type Ability struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type PokemonAbility struct {
	Ability  Ability `json:"ability"`
	IsHidden bool    `json:"is_hidden"`
	Slot     int     `json:"slot"`
}

type Cry struct {
	Latest string `json:"latest"`
	Legacy string `json:"legacy"`
}

type Form struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type Version struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type GameIndex struct {
	GameIndex int     `json:"game_index"`
	Version   Version `json:"version"`
}

type Item struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type VersionDetail struct {
	Rarity  int     `json:"rarity"`
	Version Version `json:"version"`
}

type HeldItem struct {
	Item           Item            `json:"item"`
	VersionDetails []VersionDetail `json:"version_details"`
}

type Move struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type MoveLearnMethod struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type VersionGroup struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type VersionGroupDetail struct {
	LevelLearnedAt  int             `json:"level_learned_at"`
	MoveLearnMethod MoveLearnMethod `json:"move_learn_method"`
	VersionGroup    VersionGroup    `json:"version_group"`
}

type PokemonMove struct {
	Move                Move                 `json:"move"`
	VersionGroupDetails []VersionGroupDetail `json:"version_group_details"`
}

type Species struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type Sprite struct {
	BackDefault      string  `json:"back_default"`
	BackFemale       *string `json:"back_female"`
	BackShiny        string  `json:"back_shiny"`
	BackShinyFemale  *string `json:"back_shiny_female"`
	FrontDefault     string  `json:"front_default"`
	FrontFemale      *string `json:"front_female"`
	FrontShiny       string  `json:"front_shiny"`
	FrontShinyFemale *string `json:"front_shiny_female"`
}

type OtherSprites struct {
	DreamWorld      Sprite `json:"dream_world"`
	Home            Sprite `json:"home"`
	OfficialArtwork Sprite `json:"official-artwork"`
	Showdown        Sprite `json:"showdown"`
}

type VersionSprites struct {
	GenerationI    map[string]Sprite `json:"generation-i"`
	GenerationII   map[string]Sprite `json:"generation-ii"`
	GenerationIII  map[string]Sprite `json:"generation-iii"`
	GenerationIV   map[string]Sprite `json:"generation-iv"`
	GenerationV    map[string]Sprite `json:"generation-v"`
	GenerationVI   map[string]Sprite `json:"generation-vi"`
	GenerationVII  map[string]Sprite `json:"generation-vii"`
	GenerationVIII map[string]Sprite `json:"generation-viii"`
}

type Sprites struct {
	BackDefault      string         `json:"back_default"`
	BackFemale       *string        `json:"back_female"`
	BackShiny        string         `json:"back_shiny"`
	BackShinyFemale  *string        `json:"back_shiny_female"`
	FrontDefault     string         `json:"front_default"`
	FrontFemale      *string        `json:"front_female"`
	FrontShiny       string         `json:"front_shiny"`
	FrontShinyFemale *string        `json:"front_shiny_female"`
	Other            OtherSprites   `json:"other"`
	Versions         VersionSprites `json:"versions"`
}

type Stat struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type PokemonStat struct {
	BaseStat int  `json:"base_stat"`
	Effort   int  `json:"effort"`
	Stat     Stat `json:"stat"`
}

type Type struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type PokemonType struct {
	Slot int  `json:"slot"`
	Type Type `json:"type"`
}
