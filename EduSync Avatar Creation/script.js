const VERSION = '1.6.0';
console.log(`script.js version ${VERSION}`);

let spritesManifest = {};
// Save the currently selected image for each layer.
const currentImages = {};

// Get canvas and UI elements.
const canvas = document.getElementById("spriteCanvas");
const ctx = canvas.getContext("2d");

const hueSlider = document.getElementById("hueSlider");
const satSlider = document.getElementById("satSlider");
const valSlider = document.getElementById("valSlider");

const hueValue = document.getElementById("hueValue");
const satValue = document.getElementById("satValue");
const valValue = document.getElementById("valValue");

const sectionSelect = document.getElementById("sectionSelect");
const clothingSubsection = document.getElementById("clothingSubsection");
const thumbsContainer = document.getElementById("spriteThumbsContainer");

/**
 * Returns the active category key.
 * If "Clothing" is selected, use the clothing sub‑category.
 */
function getActiveCategory() {
  return sectionSelect.value === 'Clothing' ? clothingSubsection.value : sectionSelect.value;
}

/**
 * Save the selected sprite for a given category to localStorage.
 */
function saveSelectedSprite(category, fileName) {
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  if (!avatarData.selectedSprites) {
    avatarData.selectedSprites = {};
  }
  avatarData.selectedSprites[category] = fileName;
  localStorage.setItem("avatarData", JSON.stringify(avatarData));
}

/**
 * Get the saved sprite for a given category.
 */
function getSavedSpriteForCategory(category) {
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  return avatarData.selectedSprites ? avatarData.selectedSprites[category] : null;
}

/**
 * Save the slider values for the active category.
 */
function saveAvatarColor() {
  const activeCategory = getActiveCategory();
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  if (!avatarData.slider) {
    avatarData.slider = {};
  }
  avatarData.slider[activeCategory] = {
    hue: hueSlider.value,
    sat: satSlider.value,
    val: valSlider.value
  };
  localStorage.setItem("avatarData", JSON.stringify(avatarData));
}

/**
 * Load saved slider values for the active category into the UI.
 */
function loadAvatarData() {
  const activeCategory = getActiveCategory();
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  if (avatarData.slider && avatarData.slider[activeCategory]) {
    hueSlider.value = avatarData.slider[activeCategory].hue;
    satSlider.value = avatarData.slider[activeCategory].sat;
    valSlider.value = avatarData.slider[activeCategory].val;
  } else {
    // For the active slider UI we use defaults that you want to start with.
    // (You might choose different defaults if you want the sprite to appear unaltered.)
    hueSlider.value = 0;
    satSlider.value = 100;
    valSlider.value = 100;
  }
}

/**
 * Load an image for a given category key (which may be a basic category or clothing sub‑category)
 * from the provided folder.
 */
function loadImage(categoryKey, fileName, folderPath) {
  const img = new Image();
  img.src = folderPath + fileName;
  img.onload = function () {
    // Save the image under the key (e.g. "Bases" or "Top").
    currentImages[categoryKey] = img;
    drawComposite();
    saveSelectedSprite(categoryKey, fileName);
  };
  img.onerror = function () {
    console.error("Error loading image", folderPath + fileName);
  };
  return img;
}

/**
 * Populate the thumbnail slider for the active category.
 */
function populateThumbnails(activeCategory) {
  let files = [];
  let folderPath = "";
  
  // For basic categories.
  if (["Bases", "Eyes", "Hair", "Mouths"].includes(activeCategory)) {
    files = spritesManifest[activeCategory] || [];
    folderPath = `sprites/${activeCategory}/`;
  }
  // For Clothing sub‑categories.
  else if (["Bottom", "Eyewear", "Gloves", "Hats", "Shoes", "Top"].includes(activeCategory)) {
    if (spritesManifest["Clothing"]) {
      files = spritesManifest["Clothing"][activeCategory] || [];
      folderPath = `sprites/Clothing/${activeCategory}/`;
    }
  }
  
  // Clear previous thumbnails.
  thumbsContainer.innerHTML = "";
  
  files.forEach(file => {
    const imgThumb = document.createElement("img");
    imgThumb.src = folderPath + file;
    imgThumb.alt = file;
    imgThumb.addEventListener("click", () => {
      // Remove any previous selection.
      thumbsContainer.querySelectorAll("img").forEach(img => img.classList.remove("selected"));
      imgThumb.classList.add("selected");
      loadImage(activeCategory, file, folderPath);
    });
    thumbsContainer.appendChild(imgThumb);
  });
  
  // Auto-select a saved sprite (or the first one) if available.
  if (files.length > 0) {
    let saved = getSavedSpriteForCategory(activeCategory);
    let thumb;
    if (saved && files.includes(saved)) {
      thumb = thumbsContainer.querySelector(`img[alt="${saved}"]`);
    }
    if (!thumb) {
      thumb = thumbsContainer.querySelector("img");
    }
    if (thumb) {
      thumb.classList.add("selected");
      loadImage(activeCategory, thumb.alt, folderPath);
    }
  }
}

/**
 * Convert HSV (with h in [0,360] and s,v in [0,1]) to an RGB object.
 */
function hsvToRgb(h, s, v) {
  let c = v * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = v - c;
  let r, g, b;
  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Create an offscreen canvas with the tinted version of an image.
 * (Using 'multiply' so the shading is preserved.)
 */
function getTintedCanvas(image, width, height, tintColor) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const offCtx = off.getContext("2d");
  offCtx.drawImage(image, 0, 0, width, height);
  offCtx.globalCompositeOperation = "multiply";
  offCtx.fillStyle = tintColor;
  offCtx.fillRect(0, 0, width, height);
  offCtx.globalCompositeOperation = "destination-in";
  offCtx.drawImage(image, 0, 0, width, height);
  offCtx.globalCompositeOperation = "source-over";
  return off;
}

/**
 * Draw the composite avatar from all saved layers.
 * Each layer is tinted using its own stored slider values.
 * If a layer is active, the UI’s current slider values are used.
 * For all other layers, if no values are saved, an identity tint (white)
 * is applied so that the sprite is drawn in its original colors.
 */
function drawComposite() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Define the layering order.
  const layeringOrder = [
    "Bases",
    "Bottom",  // Clothing sub-category
    "Top",     // Clothing sub-category
    "Hair",
    "Eyes",
    "Mouths",
    "Hats",    // Clothing sub-category
    "Eyewear", // Clothing sub-category
    "Gloves",  // Clothing sub-category
    "Shoes"    // Clothing sub-category
  ];
  
  // Determine the active category.
  const activeCategory = getActiveCategory();
  
  layeringOrder.forEach(layer => {
    const img = currentImages[layer];
    if (img && img.complete && img.naturalWidth !== 0) {
      // For the active category, use the slider values from the UI.
      // Otherwise, use any previously saved slider values, or default to an identity tint.
      let sliderSettings;
      if (layer === activeCategory) {
        sliderSettings = {
          hue: hueSlider.value,
          sat: satSlider.value,
          val: valSlider.value
        };
        // Update the slider display values.
        hueValue.textContent = sliderSettings.hue;
        satValue.textContent = sliderSettings.sat;
        valValue.textContent = sliderSettings.val;
      } else {
        let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
        // Default to a tint that leaves the image unchanged: saturation 0 yields white.
        sliderSettings = (avatarData.slider && avatarData.slider[layer]) || { hue: 0, sat: 0, val: 100 };
      }
      
      // Convert slider values to numbers.
      const hue = parseInt(sliderSettings.hue, 10);
      const sat = parseFloat(sliderSettings.sat) / 100;
      const val = parseFloat(sliderSettings.val) / 100;
      const rgb = hsvToRgb(hue, sat, val);
      const tintColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      
      // Draw tinted image.
      const tinted = getTintedCanvas(img, canvas.width, canvas.height, tintColor);
      ctx.drawImage(tinted, 0, 0, canvas.width, canvas.height);
    }
  });
}

/**
 * Initialize the UI: attach event listeners, load saved settings,
 * update thumbnail choices, and draw the composite.
 */
function init() {
  // When the category changes, show or hide the clothing sub‑dropdown.
  sectionSelect.addEventListener("change", () => {
    if (sectionSelect.value === "Clothing") {
      clothingSubsection.style.display = "inline";
    } else {
      clothingSubsection.style.display = "none";
    }
    loadAvatarData();
    populateThumbnails(getActiveCategory());
    drawComposite();
  });
  
  // When the clothing sub‑category changes.
  clothingSubsection.addEventListener("change", () => {
    loadAvatarData();
    populateThumbnails(getActiveCategory());
    drawComposite();
  });
  
  // Slider event listeners for the active category.
  hueSlider.addEventListener("input", () => {
    drawComposite();
    saveAvatarColor();
  });
  satSlider.addEventListener("input", () => {
    drawComposite();
    saveAvatarColor();
  });
  valSlider.addEventListener("input", () => {
    drawComposite();
    saveAvatarColor();
  });
  
  // On initial load, load stored slider values and populate thumbnails.
  loadAvatarData();
  populateThumbnails(getActiveCategory());
  drawComposite();
}

// Fetch the sprites manifest and then initialize.
fetch("sprites.json")
  .then(response => response.json())
  .then(data => {
    spritesManifest = data;
    init();
  })
  .catch(error => {
    console.error("Error loading sprites manifest:", error);
  });
