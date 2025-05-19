const VERSION = '1.6.0';
console.log(`script.js version ${VERSION}`);

let spritesManifest = {};
// Store the currently selected image for each category.
const currentImages = {};

// Get canvas and slider elements.
const canvas = document.getElementById("spriteCanvas");
const ctx = canvas.getContext("2d");

const hueSlider = document.getElementById("hueSlider");
const satSlider = document.getElementById("satSlider");
const valSlider = document.getElementById("valSlider");

const hueValue = document.getElementById("hueValue");
const satValue = document.getElementById("satValue");
const valValue = document.getElementById("valValue");

const sectionSelect = document.getElementById("sectionSelect"); // category dropdown
const thumbsContainer = document.getElementById("spriteThumbsContainer");

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
 * Save the current slider values for the current category.
 */
function saveAvatarColor() {
  const category = sectionSelect.value;
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  if (!avatarData.slider) {
    avatarData.slider = {};
  }
  avatarData.slider[category] = {
    hue: hueSlider.value,
    sat: satSlider.value,
    val: valSlider.value
  };
  localStorage.setItem("avatarData", JSON.stringify(avatarData));
}

/**
 * Load saved slider values for the current category.
 */
function loadAvatarData() {
  const category = sectionSelect.value;
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  if (avatarData.slider && avatarData.slider[category]) {
    hueSlider.value = avatarData.slider[category].hue;
    satSlider.value = avatarData.slider[category].sat;
    valSlider.value = avatarData.slider[category].val;
  } else {
    // Use default values if none saved.
    hueSlider.value = 0;
    satSlider.value = 100;
    valSlider.value = 100;
  }
}

/**
 * Load an image for a given category from the provided folder.
 */
function loadImage(category, fileName, folderPath) {
  const img = new Image();
  img.src = folderPath + fileName;
  img.onload = function() {
    currentImages[category] = img;
    drawComposite();
    saveSelectedSprite(category, fileName);
  };
  img.onerror = function() {
    console.error("Error loading image", folderPath + fileName);
  };
  return img;
}

/**
 * Populate the thumbnail slider for the specified category.
 */
function populateThumbnails(category) {
  let files = [], folderPath = "";
  
  // Determine the data and folder path based on category.
  if (category === "Bases") {
    files = spritesManifest["Bases"] || [];
    folderPath = "sprites/Bases/";
  } else if (["Bottom", "Eyewear", "Gloves", "Hats", "Shoes", "Top"].includes(category)) {
    files = (spritesManifest["Clothing"] && spritesManifest["Clothing"][category]) || [];
    folderPath = `sprites/Clothing/${category}/`;
  } else if (category === "Eyes") {
    files = spritesManifest["Eyes"] || [];
    folderPath = "sprites/Eyes/";
  } else if (category === "Hair") {
    files = spritesManifest["Hair"] || [];
    folderPath = "sprites/Hair/";
  } else if (category === "Mouths") {
    files = spritesManifest["Mouths"] || [];
    folderPath = "sprites/Mouths/";
  }
  
  // If the container element exists, clear its innerHTML; otherwise, log a warning.
  if (!thumbsContainer) {
    console.warn(`Thumbnails container not found.`);
  } else {
    thumbsContainer.innerHTML = "";
  }
  
  // Create a thumbnail for each file.
  files.forEach(file => {
    if (!thumbsContainer) return;
    const imgThumb = document.createElement("img");
    imgThumb.src = folderPath + file;
    imgThumb.alt = file;
    imgThumb.addEventListener("click", () => {
      // Remove 'selected' from all thumbnail images.
      thumbsContainer.querySelectorAll("img").forEach(img => img.classList.remove("selected"));
      imgThumb.classList.add("selected");
      loadImage(category, file, folderPath);
    });
    thumbsContainer.appendChild(imgThumb);
  });
  
  // Auto-select the saved sprite if available; otherwise, select the first thumbnail.
  if (thumbsContainer && files.length > 0) {
    let saved = getSavedSpriteForCategory(category);
    let thumb;
    if (saved && files.includes(saved)) {
      thumb = thumbsContainer.querySelector(`img[alt="${saved}"]`);
    }
    if (!thumb) {
      thumb = thumbsContainer.querySelector("img");
    }
    if (thumb) {
      thumb.classList.add("selected");
      loadImage(category, thumb.alt, folderPath);
    }
  }
}

/**
 * Converts HSV (h in [0,360], s & v in [0,1]) to an RGB object.
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
 * Create an offscreen canvas containing the tinted version of an image.
 * (Using 'multiply' so shading is preserved.)
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
 * Draw the tinted image for the currently selected category only.
 * (The canvas shows only the sprite for the active category.)
 */
function drawComposite() {
  const category = sectionSelect.value;
  
  // Update slider display.
  const hue = parseInt(hueSlider.value, 10);
  const sat = parseFloat(satSlider.value) / 100;
  const val = parseFloat(valSlider.value) / 100;
  hueValue.textContent = hue;
  satValue.textContent = satSlider.value;
  valValue.textContent = valSlider.value;
  
  const rgb = hsvToRgb(hue, sat, val);
  const tintColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const img = currentImages[category];
  if (img && img.complete && img.naturalWidth !== 0) {
    const tinted = getTintedCanvas(img, canvas.width, canvas.height, tintColor);
    ctx.drawImage(tinted, 0, 0, canvas.width, canvas.height);
  }
}

/**
 * Initialize the UI: attach event listeners, load saved color data,
 * populate thumbnails, and load the active category.
 */
function init() {
  // When the category changes, load its saved slider color, refresh thumbnails, and update the canvas.
  sectionSelect.addEventListener("change", () => {
    loadAvatarData();
    populateThumbnails(sectionSelect.value);
    drawComposite();
  });
  
  // When a slider moves, update the canvas and save the new color values.
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
  
  // For the initial load, set the saved slider values and load thumbnails for the current category.
  loadAvatarData();
  populateThumbnails(sectionSelect.value);
  drawComposite();
}

// Fetch the sprites manifest and initialize.
fetch("sprites.json")
  .then(response => response.json())
  .then(data => {
    spritesManifest = data;
    init();
  })
  .catch(error => {
    console.error("Error loading sprites manifest:", error);
  });
