/* ============================================================
   CONTENT.JS — this is the ONLY file you need to edit.
   Everything on the card (chapter text, media filenames, the
   poem, and the song) is defined here. index.html, style.css
   and app.js don't need to change for normal edits.
   ============================================================ */

const CARD_CONTENT = {

  /* Hero section at the top of the page */
  hero: {
    eyebrow: "A little something, made with love",
    title: "Happy 50th Birthday,",
    name: "Badi Mummy",
    subtitle: "Come, walk through a few of our favorite moments with you."
  },

  /* ----------------------------------------------------------
     PHOTO / VIDEO CHAPTERS
     Each chapter = one stop on the path.
     - "folder" points at a photos/ subfolder already created for you.
     - "media" is a list of files that live in that folder, in the
       order you want them to appear. Photos AND short video clips
       both work — just list the filename, the card figures out
       which is which from the extension:
         images: .jpg .jpeg .png .webp
         videos: .mp4 .webm .mov .m4v
       Example:
         media: [
           { file: "1.jpg", caption: "With her parents" },
           { file: "2.mp4", caption: "A little video from that day" }
         ]
     - Leave "media" as an empty array [] and the card will show
       friendly "add a photo" placeholders instead of breaking.
     - Any listed file that doesn't actually exist in the folder
       also falls back to a placeholder automatically — so it's
       safe to add entries ahead of uploading the files.
     - Normally a chapter opens as a swipeable carousel. Add
       `layout: "collage"` to a chapter to open it as a scattered
       photo-collage instead — a frame where each item's "group"
       decides where it lands: "left" and "right" cluster in their
       half of the frame, "scatter" (or no group at all) sprinkles
       across the whole frame, layered on top. Tapping any photo
       in the collage brings it forward.
     - Want several photos to share just ONE slide in the normal
       carousel (instead of a whole separate slide per photo)? Use
       a "collage" entry instead of "file":
         { collage: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"], caption: "..." }
       They'll show together in a small tiled grid on that one slide.
       A 2-photo collage normally sits side by side; if both photos
       are landscape, add `stack: true` to that entry to stand them
       one above the other instead, which fits landscape photos
       better: { collage: ["1.jpg", "2.jpg"], caption: "...", stack: true }
     - Want a song to play just for this chapter while it's open?
       Add a "song" field with the path to an audio file (put it in
       the song/ folder, e.g. "song/chapter-2.mp3"). It starts
       playing the moment the chapter opens, loops, and stops the
       moment the chapter is closed. Leave "song" out of a chapter
       and it stays silent. Only one chapter's song plays at a
       time, and opening a chapter closes the poem scroll (and its
       song) if it was open.
       A chapter with a "song" also plays like a slideshow: the
       photos advance on their own, evenly paced so the very last
       one lands right as the song ends, then it loops back to the
       first photo as the song restarts. Tapping the arrows or dots
       still works any time to jump around manually. A chapter with
       no "song" stays fully manual, like before.
     - Want background music that only kicks in AFTER all the videos
       in a chapter finish, then keeps playing through the rest of
       the photos/collages? Add a "bgSong" field instead of "song"
       (path to an audio file in the song/ folder). It stays silent
       during the videos, starts the moment the first photo/collage
       after them appears, loops quietly in the background, pauses
       if you swipe back to rewatch a video, and stops when the
       chapter is closed. The photos/collages after the videos are
       also paced evenly across that song's length (just like a
       "song" chapter paces its whole slideshow), so fewer slides in
       that stretch means each one lingers longer, and more slides
       means each passes more quickly. Used for Chapter 6 below.
     ---------------------------------------------------------- */
  chapters: [
    {
      title: "Aashirvaad jo hamesha rahe saath ❤️",
      blurb: "Bright eyes, a mischievous smile, and a heart that has always been this warm.",
      folder: "photos/01-where-it-all-began",
      song: "song/chapter-1.mp3",
      media: [
        { file: "with-parents.jpg", caption: "Her parents' blessing" },
        { file: "with-inlaws.jpg", caption: "Her in-laws' blessing" },
        { file: "with-loved-one-01-warm-embrace.jpg", caption: "A warm embrace" },
        { file: "with-loved-one-02-under-one-umbrella.jpg", caption: "Under one umbrella, laughing" },
      ]
    },
    {
      title: "Main apni khud ki favourite hoon 👧",
      blurb: "Just her — playful, radiant, endlessly herself.",
      folder: "photos/02-simply-her",
      song: "song/chapter-2-solo.mp3",
      media: [
        { file: "solo-01-manali-basket.jpg", caption: "Her Manali getaway" },
        { file: "solo-02-manali-mountains.jpg", caption: "Amid the Himalayas" },
        { file: "solo-03-manali-snow.jpg", caption: "Playing in the snow" },
        { file: "solo-04-cooking.jpg", caption: "Cooking up something special" },
        { file: "solo-05-festive-saree.jpg", caption: "Dressed in her festive best" },
        { file: "solo-06-pink-saree-garden.jpg", caption: "Effortlessly elegant" },
        { file: "solo-07-lehenga-dance.jpg", caption: "Dancing through celebrations" },
        { file: "solo-08-peeking-from-veil.jpg", caption: "Peeking out from under her veil" },
        { file: "solo-09-radiant-in-red-and-gold.jpg", caption: "Radiant in red and gold" },
        { file: "solo-10-caught-mid-laugh.jpg", caption: "Caught mid-laugh" },
        { file: "solo-11-by-the-sea.jpg", caption: "A sunny afternoon by the sea" },
        { file: "solo-12-royal-palace.jpg", caption: "A royal palace moment" },
        { file: "solo-13-colorful-scarf-in-the-hills.jpg", caption: "Wrapped in color, up in the hills" },
        { file: "solo-14-pink-kurti-laugh.png", caption: "That laugh, in pink" },
        { file: "solo-15-angel-wings.png", caption: "Playful and full of light" },
        { file: "solo-16-snow-capped-peaks.png", caption: "Amid the snow-capped peaks" },
        { file: "solo-17-ready-to-go.png", caption: "All dressed up and ready to go" },
        { file: "solo-18-misty-lake.png", caption: "A misty lake view" },
      ]
    },
    {
      title: "Mere priya Pati, the better half 💑",
      blurb: "Two hearts, one beautiful story that's still being written.",
      folder: "photos/03-her-better-half",
      song: "song/chapter-2.mp3",
      media: [
        { file: "01-wedding-day.jpg", caption: "Where it all began" },
        { file: "08-snowy-slopes-together.png", caption: "Bundled up on the snowy slopes" },
        { file: "09-a-hilltop-hug.png", caption: "A warm hug with the hills behind them" },
        { file: "02-out-together.jpg", caption: "Still turning heads, together" },
        { file: "10-dressed-in-gold.jpg", caption: "Dressed in gold for the occasion" },
        { file: "03-close-as-ever.jpg", caption: "Close as ever" },
        { file: "13-cutting-the-cake.jpg", caption: "Cutting the cake together" },
        { file: "04-fifty-golden-years.jpg", caption: "Fifty golden years" },
        { file: "11-a-night-to-remember.jpg", caption: "A night to remember" },
        { file: "05-still-lost-in-each-other.jpg", caption: "Still lost in each other's eyes" },
        { file: "06-a-royal-evening-out.jpg", caption: "A royal evening out" },
        { file: "12-an-elegant-evening.jpg", caption: "An elegant evening together" },
        { file: "07-a-seaside-celebration.jpg", caption: "A seaside celebration" },
      ]
    },
    {
      title: "Mere Devar aur Devrani aur main unki pyaari si Rani 👑",
      blurb: "Family you laugh easiest with — every trip, every celebration, every silly photo.",
      folder: "photos/04-her-devar-devrani",
      song: "song/chapter-3.mp3",
      media: [
        { file: "01-festive-gathering.jpg", caption: "A festive family gathering" },
        { file: "13-golden-outfits-in-the-garden.png", caption: "Matching golden outfits in the garden" },
        { file: "02-the-two-of-them.jpg", caption: "Just the two of them" },
        { file: "17-blue-outfits-together.png", caption: "All matched in blue" },
        { file: "03-sisters-at-heart.jpg", caption: "Sisters at heart" },
        { file: "11-balloon-fun.png", caption: "Balloons and big smiles" },
        { file: "04-poolside-fun.jpg", caption: "Poolside fun" },
        { file: "15-playful-on-the-lawn.png", caption: "Playful antics on the lawn" },
        { file: "05-an-adventure-together.jpg", caption: "An adventure together" },
        { file: "19-dressed-up-for-the-night.png", caption: "Dressed up for the night" },
        { file: "06-quiet-moment-above-the-city.jpg", caption: "A quiet moment above the city" },
        { file: "12-three-together.png", caption: "The three of them together" },
        { file: "07-seaside-silliness.jpg", caption: "Seaside silliness" },
        { file: "16-dancing-in-the-evening.png", caption: "Dancing away the evening" },
        { file: "21-shopping-together.jpg", caption: "All dressed up, together" },
        { file: "14-a-hill-station-visit.png", caption: "A hill-station visit together" },
        { file: "20-an-old-wedding-day-photo.jpg", caption: "An old photo from a wedding day" },
        { file: "18-a-road-trip-stop.png", caption: "A stop on the road trip" },
        { file: "10-piggyback-fun.jpg", caption: "Piggyback and pure fun" },
      ]
    },
    {
      title: "Mere 4 Anmol Ratna 💎",
      blurb: "Her four precious gems — the treasures she calls her own.",
      folder: "photos/05-mere-4-anmol-ratna",
      song: "song/chapter-5.mp3",
      media: [
        { file: "01-holi-colors-together.jpg", caption: "Colors of Holi, together" },
        { file: "02-a-sweet-moment.jpg", caption: "A sweet moment amid the celebration" },
        { file: "11-dressed-up-together.jpg", caption: "Dressed up and dressed to impress" },
        { file: "03-a-colorful-family-memory.jpg", caption: "A colorful family memory" },
        { file: "04-surrounded-by-love.jpg", caption: "Surrounded by love" },
        { file: "14-childhood-memories.jpg", caption: "A childhood memory with her boys" },
        { file: "16-two-of-her-girls.jpg", caption: "Her daughter and her devar-devrani's daughter, all dressed up" },
        { file: "17-a-sweet-bite.jpg", caption: "A sweet bite to celebrate" },
        { file: "05-silly-hugs-and-flowers.jpg", caption: "Silly hugs and flowers" },
        { file: "06-a-quiet-hug-in-the-garden.jpg", caption: "A quiet hug in the garden" },
        { file: "15-dancing-with-joy.jpg", caption: "Dancing with joy" },
        { file: "07-with-her-boys.jpg", caption: "With her boys" },
        { file: "13-with-her-boy.jpg", caption: "With her boy" },
        { file: "08-playful-as-ever.jpg", caption: "Playful as ever" },
        { file: "10-crossing-the-finish-line.jpg", caption: "Crossing the finish line together" },
        { file: "09-cheering-her-on.jpg", caption: "Cheering her on" },
        { file: "01-holi-colors-together.jpg", caption: "Colors of Holi, together" },
      ]
    },
    {
      title: "Mera Star Parivaar ⭐",
      blurb: "Every gathering, every laugh, every little moment together.",
      folder: "photos/06-family-and-fun",
      // Plays once the videos above are done and the first photo/collage
      // appears, and keeps going through the rest of the chapter.
      bgSong: "song/chapter-6.mp3",
      media: [
        { file: "15-wedding-family.jpg", caption: "" },
        { file: "01.mp4", caption: "" },
        { file: "02.mp4", caption: "" },
        { file: "05.mp4", caption: "" },
        { file: "06.mp4", caption: "" },
        { file: "07.mp4", caption: "" },
        { file: "08.mp4", caption: "" },
        { file: "09.mp4", caption: "" },
        { file: "11.mp4", caption: "" },
        { file: "12.mp4", caption: "" },
        { file: "13.mp4", caption: "" },
        { file: "14.mp4", caption: "" },
        { file: "15-wedding-family.jpg", caption: "" },
        { collage: ["16-three-generations.jpg", "17-jaali-wall-kiss.jpg", "18-balloon-arch-celebration.jpg"], caption: "A few more precious moments" },
        { collage: ["47-three-generations-outdoors.jpg", "48-laughing-together-on-the-couch.jpg", "49-a-tender-moment-together.jpg"], caption: "" },
        { collage: ["19-family-portrait.jpg", "20-blessing-the-newlyweds.jpg", "21-festive-family-portrait.jpg"], caption: "" },
        { collage: ["22-old-memories-together.jpg", "23-rooftop-with-the-skyline.jpg"], caption: "" },
        { collage: ["24-a-festive-rooftop-gathering.jpg", "25-the-whole-family-together.jpg", "43-a-floral-family-gathering.jpg"], caption: "" },
        { collage: ["35-five-of-us-together.jpg", "36-wedding-portrait-together.jpg", "38-the-whole-family-with-grandma.jpg"], caption: "More precious family moments" },
        { collage: ["26-blessing-ceremony-with-the-family.jpg", "27-festive-photo-shoot.jpg"], caption: "", stack: true },
        { collage: ["28-friends-on-the-rocks.jpg", "29-girls-day-by-the-lake.jpg"], caption: "", stack: true },
        { collage: ["30-family-game-night.jpg", "31-mehndi-hands-together.jpg", "32-outside-bonkers-corner.jpg"], caption: "" },
        { file: "39-a-joyful-hug.jpg", caption: "" },
        { collage: ["33-palace-steps-in-color.jpg", "34-veils-and-laughter.jpg"], caption: "" },
        { file: "50-four-sarees-together.jpg", caption: "" },
        { file: "51-family-in-yellow.jpg", caption: "" },
        { collage: ["40-balloons-and-baby-blessings.jpg", "41-a-tender-moment-with-baby.jpg"], caption: "" },
        { file: "42-a-family-portrait.jpg", caption: "" },
      ]
    }
  ],

  /* ----------------------------------------------------------
     POEM
     The poem now lives inside a scroll that starts rolled up.
     Tapping it unrolls the scroll and reveals these lines — one
     array entry per line. Leave "lines" as-is and the card shows
     a placeholder; replace with your own lines when it's ready.
     "song" is optional: point it at an audio file (in the song/
     folder) and it plays at full volume, from the very start,
     the moment the scroll is unrolled — and stops (and rewinds
     back to the start) the moment it's rolled back up. Leave
     "song" out and the scroll just opens silently.
     ---------------------------------------------------------- */
  poem: {
    lines: [
      "Koyi inhe dekh ke kaise kahe yeh rehte honge SAD 😔,",
      "Inki SMILE 😄 dekh ke lagta hai yeh bachpan se kar rahe COLGATE ka ad 🪥.",
      "",
      "Apne aur Parivaar 👨‍👩‍👧‍👦 main hue kai saare takraar ⚡,",
      "Par inhone kabhi nahi aane di un rishto main DARAAR 🤝.",
      "",
      "Har South Indian 🍛 aur Sandwich 🥪 waale ko lagta hai inse darr 😱,",
      "Kyonki inki CHUTNEY 🥣 aur DOSA 🥞 hai out of this world 🌍✨.",
      "",
      "Par sab kuch fail hai inki ek khoobi ke saamne 🌟,",
      "Jo hai sabki NISWARTH bhaav se madad 🤲 aur seva karna 🙏.",
      "",
      "Toh chalo celebrate 🥳 karte hai hum 3 September 📅 ka yeh SHUBHDIN ✨,",
      "Kyunki aaj hai unka Happy 50th JANAMDIN 🎂🎉!"
    ],
    signature: "— with all my love",
    song: "song/poem.mp3"
  },

  /* Closing section */
  finale: {
    title: "Happy 50th Birthday, Badi Mummy!",
    message: "Every year with you is a gift to all of us. Here's to many, many more, filled with just as much love as you've always given us.",
    signature: "With all our love"
  }
};
