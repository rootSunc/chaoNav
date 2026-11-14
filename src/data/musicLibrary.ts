export type MusicSource = {
  readonly src: string;
  readonly type: string;
};

export type MusicTrack = {
  readonly id: string;
  readonly composer: string;
  readonly title: string;
  readonly catalogue: string;
  readonly tempo: string;
  readonly contourSeed: number;
  readonly sources: readonly [MusicSource, ...MusicSource[]];
  readonly sourceUrl: string;
  readonly license: string;
};

function trackSources(stem: string): readonly [MusicSource, MusicSource] {
  return [
    { src: `/audio/${stem}.m4a`, type: "audio/mp4" },
    { src: `/audio/${stem}.ogg`, type: "audio/ogg" },
  ];
}

export const MUSIC_LIBRARY = [
  {
    id: "bach-cello-suite",
    composer: "J. S. Bach",
    title: "Cello Suite No. 1 in G Major: I. Prélude",
    catalogue: "BWV 1007",
    tempo: "Moderato · Solo Violoncello",
    contourSeed: 1,
    sources: trackSources("bach-cello-suite-1-prelude"),
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bach_-_Cello_Suite_no._1_in_G_major,_BWV_1007_-_I._Pr%C3%A9lude.ogg",
    license: "Public domain sound recording",
  },
  {
    id: "rachmaninoff-piano-concerto-2",
    composer: "S. Rachmaninoff",
    title: "Piano Concerto No. 2 in C Minor: I. Moderato",
    catalogue: "Op. 18",
    tempo: "Moderato · Piano & Orchestra",
    contourSeed: 2,
    sources: trackSources("rachmaninoff-piano-concerto-2-i-moderato"),
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Sergei_Rachmaninoff_-_piano_concerto_no._2_in_c_minor,_op._18_-_i._moderato.ogg",
    license: "Public domain via Musopen",
  },
  {
    id: "vivaldi-four-seasons",
    composer: "A. Vivaldi",
    title: "The Four Seasons — Spring: I. Allegro",
    catalogue: "RV 269",
    tempo: "Allegro · Chamber Strings",
    contourSeed: 3,
    sources: trackSources("vivaldi-four-seasons-spring-i-allegro"),
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_Modena_Chamber_Orchestra_-_Vivaldi%27s_Spring,_RV_269_-_I._Allegro.ogg",
    license: "Public Domain Mark 1.0",
  },
  {
    id: "beethoven-symphony-5",
    composer: "L. van Beethoven",
    title: "Symphony No. 5 in C Minor: III. Allegro",
    catalogue: "Op. 67",
    tempo: "Allegro · Scherzo",
    contourSeed: 4,
    sources: trackSources("beethoven-symphony-5-iii-allegro"),
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ludwig_van_Beethoven_-_symphony_no._5_in_c_minor,_op._67_-_iii._allegro.ogg",
    license: "Public domain via Musopen",
  },
  {
    id: "tchaikovsky-swan-lake",
    composer: "P. I. Tchaikovsky",
    title: "Swan Lake Suite: No. 1 Scène",
    catalogue: "Op. 20a",
    tempo: "Moderato · Oboe & Strings",
    contourSeed: 5,
    sources: trackSources("tchaikovsky-swan-lake-scene"),
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tchaikovsky_Swan_Lake_Op.20_No.10._Sc%C3%A8ne.ogg",
    license: "Public domain sound recording",
  },
  {
    id: "tchaikovsky-nutcracker",
    composer: "P. I. Tchaikovsky",
    title: "The Nutcracker Suite: Sugar Plum / Trepak",
    catalogue: "Op. 71a",
    tempo: "Andante non troppo · Presto",
    contourSeed: 6,
    sources: trackSources("tchaikovsky-nutcracker-sugar-plum-russian-dance"),
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:PDP-CH_-_National_Symphony_Orchestra_of_London_-_Stanford_Robinson,_conductor_-_The_Nutcracker_Suite,_Op._71_-_Dance_of_the_Sugar_Plum_Fairy_-_Russian_Dance_-_Tchaikovsky_-_Decca-k1142-ar9057.flac",
    license: "Public Domain Mark 1.0",
  },
] satisfies readonly [MusicTrack, ...MusicTrack[]];
