/* ============================================================
   APP.JS — the card's engine. You shouldn't need to edit this —
   edit assets/js/content.js instead to change text, photos/videos,
   the poem, or the song.
   ============================================================ */
(function(){
  "use strict";
  var C = CARD_CONTENT;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GRADS = ['grad-1','grad-2','grad-3','grad-4','grad-5'];
  var VIDEO_EXT = ['mp4','webm','mov','m4v'];

  var CAMERA_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.4"/></svg>';
  var HEART_SVG = '<svg viewBox="0 0 24 24" fill="rgba(44,23,64,.5)"><path d="M12 20s-7.5-4.6-10-9.3C.6 7.4 2.4 4 5.9 4c2 0 3.6 1.1 4.6 2.8C11.5 5.1 13.1 4 15.1 4c3.5 0 5.3 3.4 3.9 6.7C19.5 15.4 12 20 12 20z"/></svg>';

  function isVideo(filename){
    var ext = (filename || '').split('.').pop().toLowerCase();
    return VIDEO_EXT.indexOf(ext) !== -1;
  }

  /* ---------- hero + finale text from content.js ---------- */
  document.getElementById('heroEyebrow').textContent = C.hero.eyebrow;
  document.getElementById('heroTitle').textContent = C.hero.title;
  document.getElementById('heroName').textContent = C.hero.name;
  document.getElementById('heroSub').textContent = C.hero.subtitle;
  document.getElementById('finaleTitle').textContent = C.finale.title;
  document.getElementById('finaleMsg').textContent = C.finale.message;
  document.getElementById('finaleSign').textContent = C.finale.signature;

  /* ---------- poem ---------- */
  /* Glue a trailing icon to the word right before it (with a
     non-breaking space) so a line never wraps leaving a lone icon
     stranded on the next line — wrapping on a word is still fine. */
  function glueEmoji(text){
    return text.replace(/ (\p{Extended_Pictographic}+)/gu, ' $1');
  }
  var poemBody = document.getElementById('poemBody');
  poemBody.innerHTML = '';
  C.poem.lines.forEach(function(line){
    var p = document.createElement('p');
    p.textContent = glueEmoji(line);
    poemBody.appendChild(p);
  });
  document.getElementById('poemSign').textContent = C.poem.signature;

  /* ---------- poem scroll (open/close + its own song) ---------- */
  var scrollEl = document.getElementById('scroll');
  var scrollToggle = document.getElementById('scrollToggle');
  var scrollLabel = document.getElementById('scrollLabel');
  var scrollOpen = false;
  var scrollAudio = new Audio();
  scrollAudio.loop = true;
  scrollAudio.volume = 1;
  if (C.poem.song) scrollAudio.src = C.poem.song;

  function setScrollOpen(state){
    scrollOpen = state;
    scrollEl.classList.toggle('open', scrollOpen);
    scrollToggle.setAttribute('aria-expanded', scrollOpen ? 'true' : 'false');
    scrollLabel.textContent = scrollOpen ? 'Tap to roll it back up' : 'Tap to unroll the scroll';
    if (scrollOpen){
      if (typeof chapterAudio !== 'undefined' && !chapterAudio.paused){
        chapterAudio.pause();
        chapterAudio.currentTime = 0;
      }
      if (C.poem.song){
        scrollAudio.currentTime = 0;
        scrollAudio.play().catch(function(){});
      }
    } else {
      scrollAudio.pause();
      scrollAudio.currentTime = 0;
    }
  }
  scrollToggle.addEventListener('click', function(){ setScrollOpen(!scrollOpen); });

  /* ---------- render journey stops ---------- */
  var stopsEl = document.getElementById('stops');
  C.chapters.forEach(function(ch, i){
    var grad = GRADS[i % GRADS.length];
    var li = document.createElement('li');
    li.className = 'stop ' + (i % 2 === 0 ? 'stop-left' : 'stop-right');

    var marker = document.createElement('button');
    marker.className = 'stop-marker';
    marker.type = 'button';
    marker.setAttribute('aria-haspopup', 'dialog');
    marker.dataset.chapter = i;

    var photoSpan = document.createElement('span');
    photoSpan.className = 'stop-photo ' + grad;

    if (ch.media && ch.media.length){
      var firstFile = ch.media[0].file;
      var thumb;
      if (isVideo(firstFile)){
        thumb = document.createElement('video');
        thumb.src = ch.folder + '/' + firstFile;
        thumb.muted = true;
        thumb.playsInline = true;
        thumb.preload = 'metadata';
      } else {
        thumb = document.createElement('img');
        thumb.src = ch.folder + '/' + firstFile;
        thumb.alt = '';
        thumb.loading = 'lazy';
      }
      thumb.onerror = function(){
        photoSpan.innerHTML = CAMERA_SVG;
      };
      photoSpan.appendChild(thumb);
    } else {
      photoSpan.innerHTML = CAMERA_SVG;
    }

    var hint = document.createElement('span');
    hint.className = 'tap-hint';
    hint.textContent = 'Tap to open';

    marker.appendChild(photoSpan);
    marker.appendChild(hint);

    var text = document.createElement('div');
    text.className = 'stop-text';
    text.innerHTML =
      '<span class="stop-index">Chapter '+(i+1)+'</span>' +
      '<h3></h3><p></p>';
    text.querySelector('h3').textContent = ch.title;
    text.querySelector('p').textContent = ch.blurb;

    li.appendChild(marker);
    li.appendChild(text);
    stopsEl.appendChild(li);
  });

  /* ---------- reveal-on-scroll for stops ---------- */
  var stopEls = Array.prototype.slice.call(document.querySelectorAll('.stop'));
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, {threshold:.3});
    stopEls.forEach(function(el){ io.observe(el); });
  } else {
    stopEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- spine fill on scroll ---------- */
  var journeySection = document.getElementById('journey');
  var spineFill = document.getElementById('spineFill');
  function updateSpine(){
    var rect = journeySection.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height;
    var scrolled = vh * 0.6 - rect.top;
    var frac = Math.max(0, Math.min(1, scrolled / total));
    spineFill.style.height = (frac * 100) + '%';
  }
  var ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){ window.requestAnimationFrame(function(){ updateSpine(); ticking = false; }); ticking = true; }
  }, {passive:true});
  updateSpine();

  /* ---------- scroll cue ---------- */
  document.getElementById('scrollCue').addEventListener('click', function(){
    document.getElementById('journey').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
  });

  /* ---------- lightbox / carousel ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxInner = document.querySelector('.lightbox-inner');
  var lbTitle = document.getElementById('lightboxTitle');
  var lbBlurb = document.getElementById('lightboxBlurb');
  var carousel = document.getElementById('carousel');
  var carTrack = document.getElementById('carTrack');
  var carDots = document.getElementById('carDots');
  var collageHint = document.getElementById('collageHint');
  var collageFrame = document.getElementById('collageFrame');
  var carIndex = 0, activeChapter = null, activeGrad = null, lastFocused = null;
  var chapterAudio = new Audio();
  chapterAudio.loop = true;
  var chapterAutoTimer = null;

  /* A chapter can set "bgSong" instead of "song": music that stays
     silent through the chapter's videos, then starts the moment the
     first photo/collage after them appears and loops through the
     rest of the chapter (pausing again if you swipe back to a video). */
  var chapterBgAudio = new Audio();
  chapterBgAudio.loop = true;
  var bgMusicStartIdx = -1;
  var bgMusicAutoTimer = null;
  function stopBgMusicAutoAdvance(){
    if (bgMusicAutoTimer){ clearInterval(bgMusicAutoTimer); bgMusicAutoTimer = null; }
  }
  /* Paces the photos/collages that come after the videos evenly across
     the bgSong's length, the same way a "song" chapter paces its whole
     slideshow — except this only covers the stretch from bgMusicStartIdx
     to the end, and loops back to bgMusicStartIdx (not slide 0) so it
     never wanders back into the videos. */
  function startBgMusicAutoAdvance(){
    stopBgMusicAutoAdvance();
    var n = carTrack.children.length;
    var segmentCount = n - bgMusicStartIdx;
    if (segmentCount <= 1) return;
    function begin(){
      var dur = chapterBgAudio.duration;
      if (!dur || !isFinite(dur) || dur <= 0) return;
      var interval = (dur * 1000) / segmentCount;
      bgMusicAutoTimer = setInterval(function(){
        var next = carIndex + 1;
        if (next >= n) next = bgMusicStartIdx;
        goTo(next);
      }, interval);
    }
    if (chapterBgAudio.readyState >= 1 && chapterBgAudio.duration && isFinite(chapterBgAudio.duration)){
      begin();
    } else {
      chapterBgAudio.addEventListener('loadedmetadata', function onMeta(){
        chapterBgAudio.removeEventListener('loadedmetadata', onMeta);
        begin();
      });
    }
  }
  function updateChapterBgMusic(){
    if (bgMusicStartIdx < 0) return;
    if (carIndex >= bgMusicStartIdx){
      if (chapterBgAudio.paused) chapterBgAudio.play().catch(function(){});
      if (!bgMusicAutoTimer) startBgMusicAutoAdvance();
    } else {
      chapterBgAudio.pause();
      stopBgMusicAutoAdvance();
    }
  }
  function stopChapterBgMusic(){
    bgMusicStartIdx = -1;
    chapterBgAudio.pause();
    chapterBgAudio.currentTime = 0;
    stopBgMusicAutoAdvance();
  }
  function stopChapterAutoAdvance(){
    if (chapterAutoTimer){ clearInterval(chapterAutoTimer); chapterAutoTimer = null; }
  }
  function startChapterAutoAdvance(){
    stopChapterAutoAdvance();
    var n = carTrack.children.length;
    if (n <= 1) return;
    function begin(){
      var dur = chapterAudio.duration;
      if (!dur || !isFinite(dur) || dur <= 0) return;
      var interval = (dur * 1000) / n;
      chapterAutoTimer = setInterval(function(){ goTo(carIndex + 1); }, interval);
    }
    if (chapterAudio.readyState >= 1 && chapterAudio.duration && isFinite(chapterAudio.duration)){
      begin();
    } else {
      chapterAudio.addEventListener('loadedmetadata', function onMeta(){
        chapterAudio.removeEventListener('loadedmetadata', onMeta);
        begin();
      });
    }
  }

  /* For a chapter with no song: photos advance on their own after a
     few seconds, and videos autoplay and advance when they finish. */
  var slideAdvanceTimer = null;
  function clearSlideAdvance(){
    if (slideAdvanceTimer){ clearTimeout(slideAdvanceTimer); slideAdvanceTimer = null; }
  }
  function scheduleSlideAdvance(){
    clearSlideAdvance();
    if (!activeChapter || activeChapter.song) return;
    /* Once we're in the bgSong segment, startBgMusicAutoAdvance paces
       these slides against the song instead of the flat 3.5s timeout. */
    if (bgMusicStartIdx >= 0 && carIndex >= bgMusicStartIdx) return;
    var n = carTrack.children.length;
    if (n <= 1) return;
    var myIdx = carIndex;
    var currentSlide = carTrack.children[carIndex];
    if (!currentSlide) return;
    var videoEl = currentSlide.querySelector('video');
    if (videoEl){
      videoEl.currentTime = 0;
      videoEl.play().catch(function(){});
      var onEnded = function(){
        videoEl.removeEventListener('ended', onEnded);
        if (!lightbox.hidden && carIndex === myIdx) goTo(carIndex + 1);
      };
      videoEl.addEventListener('ended', onEnded);
    } else {
      slideAdvanceTimer = setTimeout(function(){
        if (!lightbox.hidden && carIndex === myIdx) goTo(carIndex + 1);
      }, 3500);
    }
  }

  var FALLBACK_CAPTIONS = ['A photo from this chapter', 'Another favorite moment', 'One more to remember', 'A memory worth keeping'];

  /* Deterministic "random" so a chapter's scatter layout looks the same every time it's opened */
  function seeded(seed){
    var x = Math.sin(seed * 999) * 10000;
    return x - Math.floor(x);
  }

  /* Bounds keep every card (at its widest, most-rotated CSS size) fully inside
     the frame — tightened by hand against .collage-card's width in style.css. */
  var COLLAGE_ZONES = {
    left:    { xMin:4,  xMax:30, yMin:5,  yMax:52 },
    right:   { xMin:62, xMax:73, yMin:5,  yMax:52 },
    scatter: { xMin:8,  xMax:73, yMin:20, yMax:55 }
  };

  function buildCollage(ch){
    collageFrame.innerHTML = '';
    var items = ch.media && ch.media.length ? ch.media : [];
    if (!items.length){
      var empty = document.createElement('p');
      empty.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;color:rgba(44,23,64,.5);font-size:.9rem;padding:20px;';
      empty.textContent = 'Photos for this chapter will appear here once they\'re added.';
      collageFrame.appendChild(empty);
      return;
    }
    // Solo/unlabeled photos render last so they sit on top of the two side groups
    var order = items.map(function(item, idx){ return {item: item, idx: idx}; })
      .sort(function(a, b){
        var rank = {left:0, right:0, scatter:1};
        return (rank[a.item.group] || 0) - (rank[b.item.group] || 0);
      });

    order.forEach(function(entry){
      var item = entry.item, idx = entry.idx;
      var zone = COLLAGE_ZONES[item.group] || COLLAGE_ZONES.scatter;
      var x = zone.xMin + seeded(idx * 3 + 1) * (zone.xMax - zone.xMin);
      var y = zone.yMin + seeded(idx * 3 + 2) * (zone.yMax - zone.yMin);
      var rot = (seeded(idx * 3 + 3) - 0.5) * (item.group === 'scatter' ? 24 : 14);

      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'collage-card';
      card.style.left = x + '%';
      card.style.top = y + '%';
      card.style.transform = 'rotate(' + rot.toFixed(1) + 'deg)';
      card.style.zIndex = String(2 + idx);

      var isVid = isVideo(item.file);
      var media = document.createElement(isVid ? 'video' : 'img');
      media.src = ch.folder + '/' + item.file;
      if (isVid){
        media.muted = true;
        media.playsInline = true;
        media.preload = 'metadata';
      } else {
        media.loading = 'lazy';
        media.alt = item.caption || ch.title;
      }
      media.onerror = function(){
        card.innerHTML = HEART_SVG.replace('rgba(44,23,64,.5)','rgba(44,23,64,.35)');
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
      };
      card.appendChild(media);

      if (item.caption){
        var cap = document.createElement('span');
        cap.className = 'cc-cap';
        cap.textContent = item.caption;
        card.appendChild(cap);
      }

      card.addEventListener('click', function(){
        var wasEnlarged = card.classList.contains('enlarged');
        Array.prototype.forEach.call(collageFrame.querySelectorAll('.collage-card.enlarged'), function(c){
          c.classList.remove('enlarged');
        });
        if (!wasEnlarged){
          card.classList.add('enlarged');
          if (isVid){
            media.controls = true;
            media.muted = false;
            media.play().catch(function(){});
          }
        } else if (isVid){
          media.pause();
        }
      });

      collageFrame.appendChild(card);
    });
  }

  function buildSlide(ch, grad, item, idx){
    var slide = document.createElement('div');
    if (item && item.collage){
      slide.className = 'car-slide has-collage';
      var grid = document.createElement('div');
      grid.className = 'car-collage-grid count-' + item.collage.length + (item.stack ? ' stack' : '');
      item.collage.forEach(function(file, cellIdx){
        var cell = document.createElement('div');
        cell.className = 'car-collage-cell';
        if (item.collage.length === 3 && cellIdx === 0){
          cell.classList.add('span-2');
        }
        var isVidCell = isVideo(file);
        var cellMedia = document.createElement(isVidCell ? 'video' : 'img');
        cellMedia.src = ch.folder + '/' + file;
        if (isVidCell){
          cellMedia.controls = true;
          cellMedia.playsInline = true;
          cellMedia.preload = 'metadata';
        } else {
          cellMedia.loading = 'lazy';
          cellMedia.alt = item.caption || ch.title;
        }
        cellMedia.onerror = function(){
          cell.innerHTML = CAMERA_SVG;
          cell.style.display = 'flex';
          cell.style.alignItems = 'center';
          cell.style.justifyContent = 'center';
        };
        cell.appendChild(cellMedia);
        grid.appendChild(cell);
      });
      slide.appendChild(grid);
      if (item.caption){
        var capC = document.createElement('div');
        capC.className = 'car-caption';
        capC.textContent = item.caption;
        slide.appendChild(capC);
      }
    } else if (item){
      slide.className = 'car-slide has-photo';
      var isVid = isVideo(item.file);
      var media = document.createElement(isVid ? 'video' : 'img');
      media.src = ch.folder + '/' + item.file;
      if (isVid){
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
      } else {
        media.loading = 'lazy';
        media.alt = item.caption || ch.title;
      }
      media.onerror = function(){
        slide.className = 'car-slide ' + grad;
        slide.innerHTML = HEART_SVG.replace('rgba(44,23,64,.5)','rgba(255,255,255,.75)') +
          '<span>Add "' + item.file + '" to ' + ch.folder + '</span>';
      };
      slide.appendChild(media);
      if (item.caption){
        var cap = document.createElement('div');
        cap.className = 'car-caption';
        cap.textContent = item.caption;
        slide.appendChild(cap);
      }
    } else {
      slide.className = 'car-slide ' + grad;
      slide.innerHTML = HEART_SVG.replace('rgba(44,23,64,.5)','rgba(255,255,255,.75)') +
        '<span>' + (FALLBACK_CAPTIONS[idx % FALLBACK_CAPTIONS.length]) + '</span>';
    }
    return slide;
  }

  function openLightbox(i){
    if (typeof scrollOpen !== 'undefined' && scrollOpen){ setScrollOpen(false); }
    activeChapter = C.chapters[i];
    activeGrad = GRADS[i % GRADS.length];
    lastFocused = document.activeElement;
    lbTitle.textContent = activeChapter.title;
    lbBlurb.textContent = activeChapter.blurb;

    var isCollage = activeChapter.layout === 'collage';
    lightboxInner.classList.toggle('wide', isCollage);
    stopChapterBgMusic();

    if (isCollage){
      carousel.hidden = true;
      carDots.hidden = true;
      collageHint.hidden = false;
      collageFrame.hidden = false;
      buildCollage(activeChapter);
    } else {
      carousel.hidden = false;
      carDots.hidden = false;
      collageHint.hidden = true;
      collageFrame.hidden = true;
      collageFrame.innerHTML = '';

      carTrack.innerHTML = '';
      carDots.innerHTML = '';
      var slots = activeChapter.media && activeChapter.media.length ? activeChapter.media : [null, null, null];
      slots.forEach(function(item, idx){
        carTrack.appendChild(buildSlide(activeChapter, activeGrad, item, idx));
        var dot = document.createElement('button');
        dot.className = 'car-dot' + (idx === 0 ? ' active' : '');
        dot.type = 'button';
        dot.setAttribute('aria-label','Item '+(idx+1));
        dot.addEventListener('click', function(){ goTo(idx); });
        carDots.appendChild(dot);
      });
      if (activeChapter.bgSong){
        if (chapterBgAudio.getAttribute('src') !== activeChapter.bgSong){
          chapterBgAudio.src = activeChapter.bgSong;
        }
        var lastVideoIdx = -1;
        slots.forEach(function(item, idx){
          if (item && item.file && isVideo(item.file)) lastVideoIdx = idx;
        });
        bgMusicStartIdx = lastVideoIdx + 1;
      }

      carIndex = 0;
      goTo(0);
    }

    lightbox.hidden = false;
    document.getElementById('lightboxClose').focus();
    document.body.style.overflow = 'hidden';

    if (activeChapter.song){
      if (chapterAudio.getAttribute('src') !== activeChapter.song){
        chapterAudio.src = activeChapter.song;
      }
      chapterAudio.currentTime = 0;
      chapterAudio.play().catch(function(){});
      startChapterAutoAdvance();
    } else {
      chapterAudio.pause();
      stopChapterAutoAdvance();
    }
  }
  function pauseAllVideos(){
    Array.prototype.forEach.call(carTrack.querySelectorAll('video'), function(v){ v.pause(); });
    Array.prototype.forEach.call(collageFrame.querySelectorAll('video'), function(v){ v.pause(); });
  }
  function closeLightbox(){
    lightbox.hidden = true;
    document.body.style.overflow = '';
    chapterAudio.pause();
    chapterAudio.currentTime = 0;
    stopChapterAutoAdvance();
    stopChapterBgMusic();
    clearSlideAdvance();
    pauseAllVideos();
    if(lastFocused) lastFocused.focus();
  }
  function goTo(idx){
    if(!activeChapter) return;
    var n = carTrack.children.length;
    pauseAllVideos();
    carIndex = (idx + n) % n;
    carTrack.style.transform = 'translateX(-' + (carIndex * 100) + '%)';
    Array.prototype.forEach.call(carDots.children, function(d,i){ d.classList.toggle('active', i === carIndex); });
    scheduleSlideAdvance();
    updateChapterBgMusic();
  }

  stopsEl.addEventListener('click', function(e){
    var btn = e.target.closest('.stop-marker');
    if(btn) openLightbox(Number(btn.dataset.chapter));
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('carPrev').addEventListener('click', function(){ goTo(carIndex - 1); });
  document.getElementById('carNext').addEventListener('click', function(){ goTo(carIndex + 1); });
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if(lightbox.hidden) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') goTo(carIndex + 1);
    if(e.key === 'ArrowLeft') goTo(carIndex - 1);
  });
  var touchStartX = null;
  carTrack.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; }, {passive:true});
  carTrack.addEventListener('touchend', function(e){
    if(touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40) goTo(carIndex + (dx < 0 ? 1 : -1));
    touchStartX = null;
  }, {passive:true});

  /* ---------- global mute ---------- */
  var muteToggle = document.getElementById('muteToggle');
  var globalMuted = false;
  function setMuted(state){
    globalMuted = state;
    chapterAudio.muted = state;
    chapterBgAudio.muted = state;
    scrollAudio.muted = state;
    muteToggle.textContent = state ? '🔇' : '🔊';
    muteToggle.setAttribute('aria-label', state ? 'Unmute' : 'Mute');
    muteToggle.setAttribute('title', state ? 'Unmute' : 'Mute');
  }
  muteToggle.addEventListener('click', function(){ setMuted(!globalMuted); });

  /* ---------- ambient particles ---------- */
  var ambientCanvas = document.getElementById('ambient-canvas');
  var actx = ambientCanvas.getContext('2d');
  var particles = [];
  var colors = ['255,182,39','255,111,145','46,196,182','255,210,122'];
  function resizeAmbient(){
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = document.documentElement.scrollHeight;
  }
  function initParticles(){
    particles = [];
    var count = reduceMotion ? 0 : Math.min(70, Math.floor(window.innerWidth / 22));
    for(var i=0;i<count;i++){
      particles.push({
        x: Math.random()*ambientCanvas.width,
        y: Math.random()*ambientCanvas.height,
        r: 1 + Math.random()*2.4,
        c: colors[i % colors.length],
        a: 0.15 + Math.random()*0.35,
        speed: 0.15 + Math.random()*0.35,
        drift: (Math.random()-0.5)*0.3
      });
    }
  }
  function drawAmbient(){
    actx.clearRect(0,0,ambientCanvas.width, ambientCanvas.height);
    particles.forEach(function(p){
      actx.beginPath();
      actx.fillStyle = 'rgba('+p.c+','+p.a+')';
      actx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      actx.fill();
      if(!reduceMotion){
        p.y -= p.speed;
        p.x += p.drift;
        if(p.y < -10){ p.y = ambientCanvas.height + 10; p.x = Math.random()*ambientCanvas.width; }
      }
    });
    if(!reduceMotion) requestAnimationFrame(drawAmbient);
  }
  resizeAmbient(); initParticles(); drawAmbient();
  window.addEventListener('resize', function(){ resizeAmbient(); initParticles(); });

  /* ---------- finale burst ---------- */
  var finaleCanvas = document.getElementById('finale-canvas');
  var fctx = finaleCanvas.getContext('2d');
  var loveBtn = document.getElementById('loveBtn');
  function sizeFinale(){
    var r = finaleCanvas.parentElement.getBoundingClientRect();
    finaleCanvas.width = r.width;
    finaleCanvas.height = r.height;
  }
  sizeFinale();
  window.addEventListener('resize', sizeFinale);

  function burst(){
    if(reduceMotion){
      loveBtn.textContent = 'Sent, with love! 💛';
      setTimeout(function(){ loveBtn.textContent = 'Send Love Back 💛'; }, 1800);
      return;
    }
    var rect = loveBtn.getBoundingClientRect();
    var parentRect = finaleCanvas.getBoundingClientRect();
    var originX = rect.left - parentRect.left + rect.width/2;
    var originY = rect.top - parentRect.top;
    var bits = [];
    var glyphs = ['💛','✨','🌼','💫'];
    for(var i=0;i<26;i++){
      bits.push({
        x:originX, y:originY,
        vx:(Math.random()-0.5)*7,
        vy:-4 - Math.random()*5,
        g:glyphs[i % glyphs.length],
        rot:Math.random()*360,
        vr:(Math.random()-0.5)*10,
        life:1
      });
    }
    loveBtn.textContent = 'Sent, with love! 💛';
    setTimeout(function(){ loveBtn.textContent = 'Send Love Back 💛'; }, 1800);

    (function anim(){
      fctx.clearRect(0,0,finaleCanvas.width, finaleCanvas.height);
      var alive = false;
      bits.forEach(function(b){
        if(b.life <= 0) return;
        alive = true;
        b.x += b.vx; b.y += b.vy; b.vy += 0.18; b.rot += b.vr; b.life -= 0.012;
        fctx.save();
        fctx.globalAlpha = Math.max(b.life,0);
        fctx.translate(b.x,b.y);
        fctx.rotate(b.rot*Math.PI/180);
        fctx.font = '22px serif';
        fctx.textAlign = 'center';
        fctx.fillText(b.g,0,0);
        fctx.restore();
      });
      if(alive) requestAnimationFrame(anim);
      else fctx.clearRect(0,0,finaleCanvas.width, finaleCanvas.height);
    })();
  }
  loveBtn.addEventListener('click', burst);
})();
