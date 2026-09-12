define([], function () {
  // console.log("show_repo loading");
  let shows = [
    {
      id: 1408,
      imdb_id: "tt0412142",
      name: "House",
      tagline: "Everybody lies.",
      status: "Ended",
      number_of_episodes: 176,
      number_of_seasons: 8,
      overview:
        "Dr. Gregory House, a drug-addicted, unconventional, misanthropic medical genius, leads a team of diagnosticians at the fictional Princeton–Plainsboro Teaching Hospital in New Jersey.",
      vote_average: 8.566,
      poster_thumbnail:
        "https://image.tmdb.org/t/p/w92/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg",
      title_type: "Show"
    },
    {
      id: 5920,
      imdb_id: "tt1196946",
      name: "The Mentalist",
      tagline: "Let the mind games begin.",
      overview:
        'Patrick Jane, a former celebrity psychic medium, uses his razor sharp skills of observation and expertise at "reading" people to solve serious crimes with the California Bureau of Investigation.',
      status: "Ended",
      number_of_episodes: 151,
      number_of_seasons: 7,
      vote_average: 8.4,
      poster_thumbnail:
        "https://image.tmdb.org/t/p/w92/acYXu4KaDj1NIkMgObnhe4C4a0T.jpg",
      title_type: "Show"
    },
    {
      id: 63174,
      imdb_id: "03",
      name: "Lucifer",
      tagline: "It's good to be bad.",
      overview:
        "Bored and unhappy as the Lord of Hell, Lucifer Morningstar abandoned his throne and retired to Los Angeles, where he has teamed up with LAPD detective Chloe Decker to take down criminals. But the longer he's away from the underworld, the greater the threat that the worst of humanity could escape.",
      status: "Ended",
      number_of_episodes: 93,
      number_of_seasons: 6,
      vote_average: 8.43,
      poster_thumbnail:
        "https://image.tmdb.org/t/p/w92/ekZobS8isE6mA53RAiGDG93hBxL.jpg",
      title_type: "Show"
    }
  ];

  function getShows() {
    return shows;
  }
  async function getServer() {
    const url = "http://localhost:1701/shows";
    const errorPanel = document.getElementById("error-panel");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();
      console.log(result);
      shows = result.programs;
      return result.programs;
    } catch (error) {
      console.error(error.message);
    }
  }

  function init() {}

  init();
  // console.log("show_repo loaded");
  return {
    init: init,
    getShows: getShows,
    getServer: getServer
  };
});
