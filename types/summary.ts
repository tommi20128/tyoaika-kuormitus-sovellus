// types/summary.ts

// Tämä tiedosto sisältää tyypit, jotka liittyvät päivä- ja viikkoyhteenvetotietoihin.

// Päivä- ja viikkoyhteenveto
export interface WorkSummary {
  hours: number;
  minutes: number;
  load?: string;
  stress1?: string;
  stress2?: string;
  stress3?: string;
  goalDiff: number;
  targetMinutes?: number;
}

//toinen versio, joka käyttää minuutteja ja laskee keskiarvot erikseen. Mietitään käytetäänkö
/*export interface WorkSummary {
    totalMinutes: number;

    averageStress: number;

    averageWorkload: number;

    targetMinutes?: number;

    goalDiff?: number;
}*/