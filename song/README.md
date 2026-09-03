# Song

Put the main closing-section audio file here (e.g. `song.mp3`) and make
sure `song.src` in `assets/js/content.js` matches the filename exactly.

You can also drop per-chapter songs in here (e.g. `chapter-2.mp3`) and
point a chapter's `song` field at it in `assets/js/content.js`. That
song plays automatically the moment the chapter is opened and stops
(and rewinds back to the start) the moment it's closed. A chapter with
a song also plays like a slideshow — see the note in `content.js`.

`poem.mp3` is the poem scroll's song — point `poem.song` at it in
`assets/js/content.js` and it plays at full volume, from the start,
the moment the scroll is unrolled, and stops the moment it's rolled
back up.
