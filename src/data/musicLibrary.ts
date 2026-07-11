export type MusicSource = {
  readonly src: string;
  readonly type: string;
};

export type MusicTrack = {
  readonly id: string;
  readonly composer: string;
  readonly title: string;
  readonly sources: readonly [MusicSource, ...MusicSource[]];
  readonly sourceUrl: string;
  readonly license: string;
};

function trackSources(stem: string): readonly [MusicSource, MusicSource] {
  return [
    { src: `/audio/${stem}.m4a`, type: 'audio/mp4' },
    { src: `/audio/${stem}.ogg`, type: 'audio/ogg' },
  ];
}

export const MUSIC_LIBRARY = [
  {
    id: 'vivaldi-four-seasons',
    composer: 'Vivaldi',
    title: 'The Four Seasons: Spring I. Allegro',
    sources: trackSources('vivaldi-four-seasons-spring-i-allegro'),
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Modena_Chamber_Orchestra_-_Vivaldi%27s_Spring,_RV_269_-_I._Allegro.ogg',
    license: 'Public Domain Mark 1.0',
  },
  {
    id: 'beethoven-symphony-5',
    composer: 'Beethoven',
    title: 'Symphony No. 5: III. Allegro',
    sources: trackSources('beethoven-symphony-5-iii-allegro'),
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ludwig_van_Beethoven_-_symphony_no._5_in_c_minor,_op._67_-_iii._allegro.ogg',
    license: 'Public domain via Musopen',
  },
  {
    id: 'bach-cello-suite',
    composer: 'Bach',
    title: 'Cello Suite No. 1: Prelude',
    sources: trackSources('bach-cello-suite-1-prelude'),
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Bach_-_Cello_Suite_no._1_in_G_major,_BWV_1007_-_I._Pr%C3%A9lude.ogg',
    license: 'Public domain sound recording',
  },
  {
    id: 'rachmaninoff-piano-concerto-2',
    composer: 'Rachmaninoff',
    title: 'Piano Concerto No. 2: I. Moderato',
    sources: trackSources('rachmaninoff-piano-concerto-2-i-moderato'),
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sergei_Rachmaninoff_-_piano_concerto_no._2_in_c_minor,_op._18_-_i._moderato.ogg',
    license: 'Public domain via Musopen',
  },
  {
    id: 'tchaikovsky-swan-lake',
    composer: 'Tchaikovsky',
    title: 'Swan Lake: Scene',
    sources: trackSources('tchaikovsky-swan-lake-scene'),
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Tchaikovsky_Swan_Lake_Op.20_No.10._Sc%C3%A8ne.ogg',
    license: 'Public domain sound recording',
  },
  {
    id: 'tchaikovsky-nutcracker',
    composer: 'Tchaikovsky',
    title: 'The Nutcracker: Sugar Plum Fairy / Russian Dance',
    sources: trackSources('tchaikovsky-nutcracker-sugar-plum-russian-dance'),
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:PDP-CH_-_National_Symphony_Orchestra_of_London_-_Stanford_Robinson,_conductor_-_The_Nutcracker_Suite,_Op._71_-_Dance_of_the_Sugar_Plum_Fairy_-_Russian_Dance_-_Tchaikovsky_-_Decca-k1142-ar9057.flac',
    license: 'Public Domain Mark 1.0',
  },
] satisfies readonly [MusicTrack, ...MusicTrack[]];
