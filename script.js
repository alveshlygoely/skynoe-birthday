/* =========================================
   SKYNOÉ - COMPLETE JAVASCRIPT FINAL
   PIN, COUNTDOWN, FLOWERS, ENVELOPE,
   MEMORY LANE, FIVE WISHES, MUSIC,
   CATCH THE HEARTS & FINAL MESSAGE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // 1. GLOBAL SETTINGS
  // =====================================

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  // =====================================
  // 2. SECRET LOCK SCREEN - PIN 0909
  // =====================================

  const pinScreen = document.getElementById("pin-screen");
  const lockscreenView = document.getElementById("lockscreen-view");
  const passcodeView = document.getElementById("passcode-view");

  const wakeScreenButton = document.getElementById("wake-screen-button");
  const pinDots = document.querySelectorAll(".pin-dot");
  const pinMessage = document.getElementById("pin-message");
  const pinKeypad = document.getElementById("pin-keypad");
  const pinBackButton = document.getElementById("pin-back-button");

  const correctPin = "0909";

  let enteredPin = "";
  let pinChecking = false;
  let pinUnlocked = false;

  function updatePinDots() {
    pinDots.forEach((dot, index) => {
      dot.classList.toggle("filled", index < enteredPin.length);
    });
  }

  function resetPin() {
    enteredPin = "";
    pinChecking = false;

    updatePinDots();

    if (pinMessage) {
      pinMessage.textContent = "ENTER YOUR PASSCODE";
      pinMessage.classList.remove("error");
    }

    pinScreen?.classList.remove("shake", "pin-success");
  }

  wakeScreenButton?.addEventListener("click", () => {
    if (pinUnlocked) return;

    resetPin();

    pinScreen?.classList.add("show-passcode");

    passcodeView?.setAttribute("aria-hidden", "false");
    lockscreenView?.setAttribute("aria-hidden", "true");
  });

  pinKeypad?.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button || pinChecking || pinUnlocked) return;

    const digit = button.dataset.digit;
    const action = button.dataset.action;

    if (action === "delete") {
      enteredPin = enteredPin.slice(0, -1);
      updatePinDots();

      if (pinMessage) {
        pinMessage.textContent = "ENTER YOUR PASSCODE";
        pinMessage.classList.remove("error");
      }

      return;
    }

    if (digit === undefined || enteredPin.length >= 4) return;

    enteredPin += digit;
    updatePinDots();

    if (enteredPin.length !== 4) return;

    pinChecking = true;

    if (enteredPin === correctPin) {
      pinUnlocked = true;

      if (pinMessage) {
        pinMessage.textContent = "A LITTLE SURPRISE IS WAITING FOR YOU ♥";
      }

      pinScreen?.classList.add("pin-success");

      window.setTimeout(
        () => {
          window.scrollTo(0, 0);

          if (pinScreen) {
            pinScreen.style.display = "none";
          }

          openingScene?.classList.add("opening-reveal");

          requestAnimationFrame(() => {
            window.scrollTo(0, 0);
          });
        },
        reducedMotion ? 0 : 1000,
      );
    } else {
      if (pinMessage) {
        pinMessage.textContent = "NOT QUITE. TRY AGAIN, LITTLE STAR.";
        pinMessage.classList.add("error");
      }

      pinScreen?.classList.add("shake");

      window.setTimeout(
        () => {
          enteredPin = "";
          pinChecking = false;

          updatePinDots();

          pinScreen?.classList.remove("shake");

          if (pinMessage) {
            pinMessage.textContent = "ENTER YOUR PASSCODE";
            pinMessage.classList.remove("error");
          }
        },
        reducedMotion ? 0 : 850,
      );
    }
  });

  pinBackButton?.addEventListener("click", () => {
    if (pinUnlocked) return;

    resetPin();

    pinScreen?.classList.remove("show-passcode");

    passcodeView?.setAttribute("aria-hidden", "true");
    lockscreenView?.setAttribute("aria-hidden", "false");
  });

  // =====================================
  // 3. COUNTDOWN - 13 OCTOBER
  // =====================================

  const countdownDays = document.getElementById("countdown-days");
  const countdownHours = document.getElementById("countdown-hours");
  const countdownMinutes = document.getElementById("countdown-minutes");
  const countdownSeconds = document.getElementById("countdown-seconds");

  const lockscreenDate = document.getElementById("lockscreen-date");

  const birthdayMonth = 9;
  const birthdayDay = 13;

  function getNextBirthday() {
    const now = new Date();

    let target = new Date(now.getFullYear(), birthdayMonth, birthdayDay, 0, 0, 0, 0);

    if (target <= now) {
      target = new Date(now.getFullYear() + 1, birthdayMonth, birthdayDay, 0, 0, 0, 0);
    }

    return target;
  }

  const nextBirthday = getNextBirthday();

  if (lockscreenDate) {
    lockscreenDate.textContent = "13 OCTOBER";
  }

  function updateCountdown() {
    if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;

    const difference = nextBirthday.getTime() - Date.now();

    if (difference <= 0) {
      countdownDays.textContent = "000";
      countdownHours.textContent = "00";
      countdownMinutes.textContent = "00";
      countdownSeconds.textContent = "00";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    const seconds = Math.floor((difference / 1000) % 60);

    countdownDays.textContent = String(days).padStart(3, "0");
    countdownHours.textContent = String(hours).padStart(2, "0");
    countdownMinutes.textContent = String(minutes).padStart(2, "0");
    countdownSeconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // =====================================
  // 4. BACKGROUND MUSIC PLAYER
  // =====================================

  const backgroundMusic = document.getElementById("background-music");
  const musicToggle = document.getElementById("music-toggle");
  const musicPlayer = document.getElementById("music-player");

  let musicPlaying = false;

  function updateMusicButton() {
    if (!musicToggle) return;

    musicPlayer?.classList.toggle("playing", musicPlaying);

    musicToggle.textContent = musicPlaying ? "Ⅱ" : "♫";

    musicToggle.setAttribute("aria-label", musicPlaying ? "Pause music" : "Play music");
  }

  if (backgroundMusic && musicToggle) {
    musicToggle.addEventListener("click", async () => {
      try {
        if (backgroundMusic.paused) {
          await backgroundMusic.play();
        } else {
          backgroundMusic.pause();
        }
      } catch (error) {
        console.log("Musik belum bisa diputar:", error);
      }
    });

    backgroundMusic.addEventListener("play", () => {
      musicPlaying = true;
      updateMusicButton();
    });

    backgroundMusic.addEventListener("pause", () => {
      musicPlaying = false;
      updateMusicButton();
    });

    backgroundMusic.addEventListener("ended", () => {
      musicPlaying = false;
      updateMusicButton();
    });
  }

  updateMusicButton();

  // =====================================
  // 5. ELEMENTS & SETTINGS
  // =====================================

  const starsContainer = document.getElementById("stars-container");
  const flowersContainer = document.getElementById("flowers-container");

  const enterButton = document.getElementById("enter-button");

  const openingScene = document.getElementById("opening-scene");
  const surpriseScene = document.getElementById("surprise-scene");

  const envelopeButton = document.getElementById("envelope-button");
  const letterMessage = document.getElementById("letter-message");

  const memoryButton = document.getElementById("memory-button");
  const memoryScene = document.getElementById("memory-scene");

  const finalScene = document.getElementById("final-scene");

  let letterOpened = false;
  let memoryVisited = false;
  let entering = false;

  // =====================================
  // 6. STARS
  // =====================================

  function createStars(total = 85) {
    if (!starsContainer) return;

    starsContainer.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const star = document.createElement("span");
      const size = randomBetween(1, 3.5);

      star.className = "star";

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${randomBetween(2, 5)}s`;

      starsContainer.appendChild(star);
    }
  }

  // =====================================
  // 7. FLOWER ILLUSTRATIONS
  // =====================================

  function createRose(id) {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rose-${id}" cx="45%" cy="38%">
            <stop offset="0%" stop-color="#f5c3c0"/>
            <stop offset="55%" stop-color="#d98798"/>
            <stop offset="100%" stop-color="#a94f69"/>
          </radialGradient>
        </defs>

        <g fill="#bd7185">
          <ellipse cx="50" cy="22" rx="17" ry="27"/>
          <ellipse cx="50" cy="78" rx="17" ry="27"/>
          <ellipse cx="22" cy="50" rx="27" ry="17"/>
          <ellipse cx="78" cy="50" rx="27" ry="17"/>
          <ellipse cx="30" cy="30" rx="18" ry="25" transform="rotate(-45 30 30)"/>
          <ellipse cx="70" cy="30" rx="18" ry="25" transform="rotate(45 70 30)"/>
          <ellipse cx="30" cy="70" rx="18" ry="25" transform="rotate(45 30 70)"/>
          <ellipse cx="70" cy="70" rx="18" ry="25" transform="rotate(-45 70 70)"/>
        </g>

        <g fill="url(#rose-${id})">
          <ellipse cx="50" cy="34" rx="13" ry="22"/>
          <ellipse cx="50" cy="66" rx="13" ry="22"/>
          <ellipse cx="34" cy="50" rx="22" ry="13"/>
          <ellipse cx="66" cy="50" rx="22" ry="13"/>
          <ellipse cx="39" cy="39" rx="15" ry="19" transform="rotate(-45 39 39)"/>
          <ellipse cx="61" cy="39" rx="15" ry="19" transform="rotate(45 61 39)"/>
          <ellipse cx="39" cy="61" rx="15" ry="19" transform="rotate(45 39 61)"/>
          <ellipse cx="61" cy="61" rx="15" ry="19" transform="rotate(-45 61 61)"/>
        </g>

        <circle cx="50" cy="50" r="12" fill="#a94f69"/>

        <path
          d="M50 40 C68 42 64 59 50 61 C37 60 37 45 50 44 C60 44 59 54 51 55"
          fill="none"
          stroke="#f8d0c8"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
    `;
  }

  function createSakura(id) {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sakura-${id}">
            <stop offset="0%" stop-color="#fff0e9"/>
            <stop offset="100%" stop-color="#e9a9ba"/>
          </radialGradient>
        </defs>

        <g fill="url(#sakura-${id})" stroke="#d78da5" stroke-width="1.2">
          <path d="M50 48 C36 38 34 17 50 8 C66 17 64 38 50 48Z"/>
          <path d="M52 48 C66 34 87 37 92 52 C82 68 62 63 52 48Z"/>
          <path d="M52 52 C67 65 65 85 50 93 C35 85 34 65 52 52Z"/>
          <path d="M48 52 C34 66 14 63 8 48 C18 33 38 38 48 52Z"/>
          <path d="M49 48 C38 31 44 16 50 13 C65 24 62 39 49 48Z" transform="rotate(45 50 50)"/>
        </g>

        <circle cx="50" cy="50" r="9" fill="#e6b66e"/>
        <circle cx="50" cy="50" r="4" fill="#fff0c9"/>
      </svg>
    `;
  }

  function createDaisy() {
    let petals = "";

    for (let i = 0; i < 12; i++) {
      petals += `
        <ellipse
          cx="50"
          cy="25"
          rx="8"
          ry="19"
          fill="#fff0e3"
          stroke="#e9d4c9"
          stroke-width="0.8"
          transform="rotate(${i * 30} 50 50)"
        />
      `;
    }

    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${petals}
        <circle cx="50" cy="50" r="14" fill="#e8b85d"/>
        <circle cx="50" cy="50" r="9" fill="#f6d88f"/>
        <circle cx="46" cy="46" r="2" fill="#fff0c9"/>
        <circle cx="55" cy="48" r="2" fill="#fff0c9"/>
        <circle cx="50" cy="55" r="2" fill="#fff0c9"/>
      </svg>
    `;
  }

  function createViolet(id) {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="violet-${id}">
            <stop offset="0%" stop-color="#d7a4dc"/>
            <stop offset="100%" stop-color="#8c679e"/>
          </radialGradient>
        </defs>

        <g fill="url(#violet-${id})" stroke="#75527f" stroke-width="1.2">
          <ellipse cx="50" cy="29" rx="16" ry="25"/>
          <ellipse cx="29" cy="45" rx="23" ry="17" transform="rotate(-35 29 45)"/>
          <ellipse cx="71" cy="45" rx="23" ry="17" transform="rotate(35 71 45)"/>
          <ellipse cx="38" cy="70" rx="18" ry="24" transform="rotate(20 38 70)"/>
          <ellipse cx="62" cy="70" rx="18" ry="24" transform="rotate(-20 62 70)"/>
        </g>

        <circle cx="50" cy="52" r="9" fill="#f0d8a9"/>
        <circle cx="50" cy="52" r="4" fill="#fff1c9"/>
      </svg>
    `;
  }

  // =====================================
  // 8. FLOWER TYPES
  // =====================================

  const flowerTypes = ["rose", "rose", "rose", "rose", "rose", "rose", "sakura", "daisy", "violet"];

  function randomFlowerType() {
    return flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
  }

  function getFlowerArtwork(type, id) {
    switch (type) {
      case "rose":
        return createRose(id);
      case "sakura":
        return createSakura(id);
      case "daisy":
        return createDaisy();
      case "violet":
        return createViolet(id);
      default:
        return createRose(id);
    }
  }

  // =====================================
  // 9. FLOWER POSITIONS
  // =====================================

  function generatePositions(total) {
    const zones = [
      {
        minY: 5,
        maxY: 36,
        count: Math.round(total * 0.32),
      },
      {
        minY: 28,
        maxY: 70,
        count: Math.round(total * 0.36),
      },
      {
        minY: 62,
        maxY: 96,
        count: 0,
      },
    ];

    zones[2].count = total - zones[0].count - zones[1].count;

    const positions = [];
    const columns = 12;

    zones.forEach((zone) => {
      const slots = [];

      for (let i = 0; i < zone.count; i++) {
        slots.push(i % columns);
      }

      shuffle(slots).forEach((slot) => {
        const columnWidth = 100 / columns;

        const x = slot * columnWidth + randomBetween(2, columnWidth - 2);

        positions.push({
          x: Math.max(2, Math.min(98, x)),
          y: randomBetween(zone.minY, zone.maxY),
        });
      });
    });

    return shuffle(positions);
  }

  // =====================================
  // 10. STARTING CLUSTERS
  // =====================================

  const clusters = [
    { x: 18, y: 35 },
    { x: 50, y: 25 },
    { x: 80, y: 40 },
    { x: 32, y: 72 },
    { x: 70, y: 76 },
  ];

  function getStartingPoint() {
    const cluster = clusters[Math.floor(Math.random() * clusters.length)];

    return {
      x: cluster.x + randomBetween(-7, 7),
      y: cluster.y + randomBetween(-7, 7),
    };
  }

  // =====================================
  // 11. FLOATING ANIMATION
  // =====================================

  function startFloating(flower) {
    if (reducedMotion) return;

    const distance = randomBetween(3, 8);
    const rotation = randomBetween(-3, 3);
    const duration = randomBetween(4000, 6000);

    flower.animate(
      [
        {
          transform: `
            translate(-50%, -50%)
            rotate(${flower.dataset.rotation}deg)
            translateY(0px)
          `,
        },
        {
          transform: `
            translate(-50%, -50%)
            rotate(${Number(flower.dataset.rotation) + rotation}deg)
            translateY(-${distance}px)
          `,
        },
        {
          transform: `
            translate(-50%, -50%)
            rotate(${flower.dataset.rotation}deg)
            translateY(0px)
          `,
        },
      ],
      {
        duration,
        iterations: Infinity,
        easing: "ease-in-out",
      },
    );
  }

  // =====================================
  // 12. SCATTER ANIMATION
  // =====================================

  function scatterFlower(flower, start, target, delay) {
    if (reducedMotion) {
      flower.style.opacity = "1";

      flower.style.transform = `
        translate(-50%, -50%)
        rotate(${flower.dataset.rotation}deg)
      `;

      return;
    }

    const width = flowersContainer.clientWidth;
    const height = flowersContainer.clientHeight;

    const offsetX = ((start.x - target.x) * width) / 100;
    const offsetY = ((start.y - target.y) * height) / 100;

    const rotation = flower.dataset.rotation;

    const startTransform = `
      translate(-50%, -50%)
      translate(${offsetX}px, ${offsetY}px)
      rotate(${rotation}deg)
      scale(0.25)
    `;

    const endTransform = `
      translate(-50%, -50%)
      rotate(${rotation}deg)
      scale(1)
    `;

    const duration = randomBetween(2800, 3800);

    flower.style.opacity = "0";
    flower.style.transform = endTransform;

    const animation = flower.animate(
      [
        {
          opacity: 0,
          transform: startTransform,
        },
        {
          opacity: 1,
          transform: endTransform,
        },
      ],
      {
        duration,
        delay,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      },
    );

    animation.onfinish = () => {
      flower.style.opacity = "1";
      flower.style.transform = endTransform;

      animation.cancel();

      startFloating(flower);
    };
  }

  // =====================================
  // 13. CREATE FLOWER
  // =====================================

  let flowerCounter = 0;

  function createFlower(position, index) {
    if (!flowersContainer) return;

    const flower = document.createElement("div");

    const id = `skynoe-flower-${flowerCounter++}`;
    const type = randomFlowerType();

    flower.className = "garden-flower";
    flower.dataset.type = type;

    let size = index < 72 ? randomBetween(23, 40) : randomBetween(34, 58);

    if (type === "rose") {
      size *= 1.12;
    }

    const rotation = randomBetween(-25, 25);

    flower.dataset.rotation = rotation;

    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;

    flower.style.left = `${position.x}%`;
    flower.style.top = `${position.y}%`;

    flower.style.zIndex = index < 72 ? "2" : "4";

    flower.innerHTML = getFlowerArtwork(type, id);

    flowersContainer.appendChild(flower);

    const start = getStartingPoint();

    const delay = reducedMotion ? 0 : randomBetween(0, 1000);

    scatterFlower(flower, start, position, delay);
  }

  // =====================================
  // 14. GENERATE GARDEN
  // =====================================

  function createGarden() {
    if (!flowersContainer) return;

    flowersContainer.innerHTML = "";
    flowerCounter = 0;

    const totalFlowers = 100;
    const positions = generatePositions(totalFlowers);

    positions.forEach((position, index) => {
      createFlower(position, index);
    });
  }

  if (starsContainer) {
    createStars(80);
  }

  if (flowersContainer) {
    createGarden();
  }

  // =====================================
  // 15. ENTER BUTTON
  // =====================================

  enterButton?.addEventListener("click", () => {
    if (entering) return;

    entering = true;
    enterButton.disabled = true;

    openingScene?.classList.add("is-leaving");

    window.setTimeout(
      () => {
        surpriseScene?.classList.add("active");
      },
      reducedMotion ? 0 : 1200,
    );
  });

  // =====================================
  // 16. ENVELOPE BUTTON
  // =====================================

  if (memoryButton) {
    memoryButton.disabled = true;
  }

  envelopeButton?.addEventListener("click", () => {
    if (letterOpened) return;

    letterOpened = true;

    envelopeButton.classList.add("opened");

    window.setTimeout(
      () => {
        letterMessage?.classList.add("visible");

        if (memoryButton) {
          memoryButton.disabled = false;
        }
      },
      reducedMotion ? 0 : 650,
    );
  });

  // =====================================
  // 17. MEMORY LANE NAVIGATION
  // =====================================

  memoryButton?.addEventListener("click", () => {
    if (!letterOpened || memoryVisited) return;

    memoryVisited = true;
    memoryButton.disabled = true;

    memoryScene?.classList.add("show-memories");

    memoryScene?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });

  // =====================================
  // 18. PHOTO LIGHTBOX
  // =====================================

  const memoryPhotos = document.querySelectorAll(".memory-photo img");

  if (memoryPhotos.length > 0) {
    const lightbox = document.createElement("div");

    lightbox.className = "photo-lightbox";

    lightbox.innerHTML = `
      <button
        class="lightbox-close"
        type="button"
        aria-label="Close"
      >
        &times;
      </button>

      <img
        class="lightbox-image"
        src=""
        alt="Expanded memory"
      >
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const closeButton = lightbox.querySelector(".lightbox-close");

    let previousBodyOverflow = "";

    function openLightbox(photo) {
      previousBodyOverflow = document.body.style.overflow;

      lightboxImage.src = photo.currentSrc || photo.src;
      lightboxImage.alt = photo.alt || "Memory photo";

      lightbox.classList.add("active");

      document.body.style.overflow = "hidden";

      closeButton.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("active");

      document.body.style.overflow = previousBodyOverflow;

      lightboxImage.src = "";
    }

    memoryPhotos.forEach((photo) => {
      photo.style.cursor = "zoom-in";

      photo.addEventListener("click", () => {
        openLightbox(photo);
      });
    });

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  // =====================================
  // 19. FIVE LITTLE WISHES
  // =====================================

  const wishesSection = document.getElementById("wishes-section");
  const wishBottle = document.getElementById("wish-bottle");
  const wishDisplay = document.getElementById("wish-display");

  const bottleRollsContainer = wishBottle?.querySelector(".bottle-rolls");

  const bottleCaption = wishesSection?.querySelector(".bottle-caption");

  const littleWishes = [
    {
      message: "May happiness find you in the smallest things, even on the days you least expect it.",
      ending: "You deserve all the little joys. ♥",
    },
    {
      message: "May the dreams you keep quietly in your heart slowly find their way into your life.",
      ending: "Keep believing in yourself. ✦",
    },
    {
      message: "May you meet people who love you gently and never make you question your worth.",
      ending: "You deserve to feel loved. ♥",
    },
    {
      message: "May your laughter come often, your worries feel lighter, and your heart feel safe.",
      ending: "May life be gentle with you. ✧",
    },
    {
      message: "May this new chapter bring you a thousand beautiful things you haven't even imagined yet. Happy birthday.",
      ending: "Here's to everything waiting for you. ♥",
    },
  ];

  let currentWish = 0;
  let bottleBusy = false;

  // CREATE FIVE PAPER ROLLS

  const wishRolls = [];

  if (bottleRollsContainer) {
    bottleRollsContainer.innerHTML = "";

    littleWishes.forEach((_, index) => {
      const roll = document.createElement("span");

      roll.className = "wish-roll";
      roll.dataset.wish = String(index + 1);
      roll.setAttribute("aria-hidden", "true");

      bottleRollsContainer.appendChild(roll);
      wishRolls.push(roll);
    });
  }

  // DISPLAY ONE WISH

  function displayWish(index) {
    if (!wishDisplay) return;

    const wish = littleWishes[index];

    if (!wish) return;

    wishDisplay.innerHTML = `
      <div class="wish-opened">
        <p class="wish-number">
          A LITTLE WISH · ${index + 1} OF ${littleWishes.length}
        </p>

        <p class="wish-message">${wish.message}</p>

        <p class="wish-end">${wish.ending}</p>
      </div>
    `;
  }

  // RELEASE ONE ROLL

  async function releaseWish() {
    if (bottleBusy || currentWish >= littleWishes.length || wishBottle?.disabled) {
      return;
    }

    bottleBusy = true;

    const roll = wishRolls[currentWish];

    wishBottle?.classList.add("wish-opening", "bottle-open");
    wishesSection?.classList.add("bottle-open");

    if (bottleCaption) {
      bottleCaption.textContent = "A little wish is finding its way to you...";
    }

    if (roll) {
      if (!reducedMotion) {
        const animation = roll.animate(
          [
            {
              opacity: 1,
              transform: "translate(0, 0) rotate(0deg) scale(1)",
            },
            {
              opacity: 1,
              transform: "translate(8px, -22px) rotate(100deg) scale(1.15)",
              offset: 0.55,
            },
            {
              opacity: 0,
              transform: "translate(24px, -75px) rotate(240deg) scale(0.7)",
            },
          ],
          {
            duration: 750,
            easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
          },
        );

        await animation.finished.catch(() => {});
      }

      roll.classList.add("removed");
      roll.setAttribute("aria-hidden", "true");
      roll.style.pointerEvents = "none";
      roll.hidden = true;
    }

    displayWish(currentWish);

    currentWish++;

    const remaining = littleWishes.length - currentWish;

    if (bottleCaption) {
      bottleCaption.textContent = remaining > 0 ? `${remaining} little wishes left · Tap the bottle again` : "All five wishes have found their way to you ♥";
    }

    await wait(reducedMotion ? 0 : 450);

    wishBottle?.classList.remove("wish-opening");

    if (currentWish >= littleWishes.length) {
      wishBottle?.classList.add("bottle-finished");
      wishBottle?.setAttribute("aria-label", "The bottle is empty");
      wishBottle.disabled = true;
    }

    bottleBusy = false;
  }

  if (wishBottle && wishDisplay && bottleRollsContainer) {
    wishDisplay.innerHTML = "";
    wishBottle.addEventListener("click", releaseWish);
  }

  // =====================================
  // 20. FINAL MESSAGE REVEAL
  // =====================================

  if (finalScene && "IntersectionObserver" in window) {
    const finalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            finalScene.classList.add("show-final");
            finalObserver.unobserve(finalScene);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
      },
    );

    finalObserver.observe(finalScene);
  } else if (finalScene) {
    finalScene.classList.add("show-final");
  }

  // =====================================
  // 21. CATCH THE HEARTS GAME
  // =====================================

  const gameScene = document.getElementById("game-scene");
  const gameArea = document.getElementById("game-area");
  const gameBasket = document.getElementById("game-basket");

  const gameStart = document.getElementById("game-start");
  const startGameButton = document.getElementById("start-game-button");

  const heartScore = document.getElementById("heart-score");
  const gameResult = document.getElementById("game-result");

  const continueFinalButton = document.getElementById("continue-final-button");

  if (gameScene && gameArea && gameBasket && gameStart && startGameButton && heartScore && gameResult) {
    const targetScore = 10;

    let score = 0;
    let gameRunning = false;
    let animationFrame = null;
    let lastHeartTime = 0;

    let hearts = [];

    // MOVE BASKET

    function updateBasket(clientX) {
      const rect = gameArea.getBoundingClientRect();

      if (!rect.width) return;

      const basketWidth = gameBasket.offsetWidth;

      const halfBasketPercent = (basketWidth / 2 / rect.width) * 100;

      let position = ((clientX - rect.left) / rect.width) * 100;

      position = Math.max(halfBasketPercent, Math.min(100 - halfBasketPercent, position));

      gameBasket.style.left = `${position}%`;
    }

    // CREATE FALLING HEART

    function createFallingHeart() {
      if (!gameRunning) return;

      const heart = document.createElement("span");

      heart.className = "game-heart";
      heart.textContent = Math.random() > 0.5 ? "♥" : "♡";

      const x = randomBetween(5, 95);
      const speed = randomBetween(1.5, 2.8);

      heart.style.left = `${x}%`;
      heart.style.fontSize = `${randomBetween(22, 32)}px`;

      gameArea.appendChild(heart);

      hearts.push({
        element: heart,
        y: -35,
        speed,
      });
    }

    // UPDATE SCORE

    function updateScore() {
      heartScore.textContent = `${score} / ${targetScore}`;
    }

    // FINISH GAME

    function finishGame() {
      if (!gameRunning) return;

      gameRunning = false;

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      hearts.forEach((heart) => {
        heart.element.remove();
      });

      hearts = [];

      gameResult.classList.add("show");
    }

    // GAME LOOP

    function gameLoop(timestamp) {
      if (!gameRunning) return;

      if (timestamp - lastHeartTime > 1400) {
        createFallingHeart();
        lastHeartTime = timestamp;
      }

      const areaRect = gameArea.getBoundingClientRect();
      const basketRect = gameBasket.getBoundingClientRect();

      const remainingHearts = [];

      for (const heart of hearts) {
        if (!gameRunning) break;

        heart.y += heart.speed;
        heart.element.style.top = `${heart.y}px`;

        const heartRect = heart.element.getBoundingClientRect();

        const caught = heartRect.bottom >= basketRect.top && heartRect.top <= basketRect.bottom && heartRect.right >= basketRect.left && heartRect.left <= basketRect.right;

        if (caught) {
          heart.element.remove();

          score++;
          updateScore();

          if (score >= targetScore) {
            finishGame();
            break;
          }

          continue;
        }

        if (heart.y > gameArea.clientHeight) {
          heart.element.remove();
          continue;
        }

        remainingHearts.push(heart);
      }

      if (gameRunning) {
        hearts = remainingHearts;
        animationFrame = requestAnimationFrame(gameLoop);
      }
    }

    // START GAME

    function startGame() {
      if (gameRunning) return;

      hearts.forEach((heart) => {
        heart.element.remove();
      });

      hearts = [];
      score = 0;
      lastHeartTime = 0;

      updateScore();

      gameResult.classList.remove("show");
      gameStart.classList.add("hidden");

      gameBasket.style.left = "50%";

      gameRunning = true;

      animationFrame = requestAnimationFrame(gameLoop);
    }

    startGameButton.addEventListener("click", startGame);

    // MOUSE / TOUCH MOVEMENT

    gameArea.addEventListener("pointermove", (event) => {
      if (!gameRunning) return;

      updateBasket(event.clientX);
    });

    gameArea.addEventListener("pointerdown", (event) => {
      if (!gameRunning) return;

      updateBasket(event.clientX);
    });

    // CONTINUE TO FINAL

    continueFinalButton?.addEventListener("click", () => {
      finalScene?.classList.add("show-final");

      finalScene?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  // =====================================
  // 22. INITIAL STATE
  // =====================================

  updatePinDots();

  console.log("SKYNOÉ JavaScript berhasil dimuat ♥");
});
