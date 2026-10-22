# Movie library data sources

The catalogue is bundled with TWO. Visitors need no connector, account, token or movie API key. Remote requests are used only to display the referenced poster images and when visitors explicitly open external links.

## Editorial data

- The original 95 local movie IDs remain unchanged, preserving rooms, votes, favourites and archive entries.
- 207 added entries have Russian editorial titles and original, rewritten plot summaries. Metadata is joined by movie identity, not by approximate title alone. The 1999 version of The Thomas Crown Affair is selected explicitly.
- Missing posters and ratings remain missing; the interface uses a typographic image fallback and “Нет оценки”. No generated image is presented as a film poster and no rating is invented.

## TMDB snapshot via CrawlFeeds

- Dataset: https://github.com/CrawlFeeds/movies-datasets
- File: movies_dataset_1000_records_sample.csv
- Source Git blob: 6ad8a111cdbc79ae060205886781bf41b3d14b06
- Collection timestamp in the selected records: 24 July 2026.
- Provider: CrawlFeeds (2026), Movies Dataset. License: Creative Commons Attribution 4.0, https://creativecommons.org/licenses/by/4.0/ .
- Fields retained: film identity, release year, runtime, genre, poster URL, director, TMDB average and vote count. Titles and descriptions were translated or rewritten and selected records were filtered. The snapshot is not a live feed. Imported release days are not independently verified and are deliberately reduced to year precision; the historical-date eligibility rule treats year-only releases conservatively.
- TMDB: https://www.themoviedb.org/ . TWO is independent of and is not endorsed by TMDB.

## Additional TMDB rating snapshot

- Dataset: https://github.com/HERALDEXX/tmdb-movie-scraper
- File: tmdb_movies.csv, Git blob 430c2409dabcdfef1518b0e2ba34d5763b361b6e.
- Dataset date stated by the provider: 11 August 2025.
- Provider: Herald Inyang / HERALDEXX. MIT license; notice retained below.
- Only matching title/year ratings are used. Casablanca's 1942 premiere/1943 general release and Begin Again's 2013 festival/2014 theatrical release are explicitly reconciled. A newer exact matching CrawlFeeds snapshot takes precedence.

## Poster reference metadata

- https://github.com/servant-42/wikipedia-movie-data ; 1990s, 2000s, 2010s and 2020s snapshots.
- Only matching poster thumbnail URLs and Wikipedia source-page links are retained. Wikipedia article extracts are not republished.
- Posters remain the property of their respective rightsholders. Dataset/code licences do not transfer rights to the artwork. Posters are displayed as identifying catalogue thumbnails with links to source pages available in film details.

## Rating display

Ratings show their provider and snapshot date and link to the provider. TMDB values remain on the original 0–10 scale. Imported vote counts are shown only when present. No ranking is labelled as a current live rating.

## MIT notice — additional rating dataset

```text
MIT License

Copyright (c) 2025 Herald Inyang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
