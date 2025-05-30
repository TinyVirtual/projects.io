const VERSION = '1.6.2';
console.log(`script.js version ${VERSION}`);
const defaultAvatar = '{"selectedSprites":{"Bases":"human.png","Eyes":"eyes1.png","Mouths":"mouth3.png","Hair":"hair1.png","Bottom":"pants3.png","Top":"shirt4.png","Shoes":"shoes2.png"},"slider":{"Bases":{"hue":"31","sat":"33","val":"100"},"Eyes":{"hue":"0","sat":"0","val":"0"},"Mouths":{"hue":"0","sat":"23","val":"30"},"Hair":{"hue":"31","sat":"70","val":"44"},"Bottom":{"hue":"192","sat":"100","val":"61"},"Top":{"hue":"179","sat":"7","val":"82"},"Shoes":{"hue":"208","sat":"18","val":"38"}}}'

let spritesManifest = {};
// Stores the currently selected image for each layer.
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
 * If "Clothing" is selected, the clothing sub‑category is used.
 */
function getActiveCategory() {
  return sectionSelect.value === 'Clothing' ? clothingSubsection.value : sectionSelect.value;
}

/**
 * Save the selected sprite for a given category to localStorage.
 */
function saveSelectedSprite(category, fileName) {
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || defaultAvatar);
  if (!avatarData.selectedSprites) {
    avatarData.selectedSprites = {};
  }
  avatarData.selectedSprites[category] = fileName;
  localStorage.setItem("avatarData", JSON.stringify(avatarData));
}

/**
 * Retrieve the saved sprite for a given category.
 */
function getSavedSpriteForCategory(category) {
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || defaultAvatar);
  return avatarData.selectedSprites ? avatarData.selectedSprites[category] : null;
}

/**
 * Save slider values for the active category.
 */
function saveAvatarColor() {
  const activeCategory = getActiveCategory();
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || defaultAvatar);
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
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || defaultAvatar);
  if (avatarData.slider && avatarData.slider[activeCategory]) {
    hueSlider.value = avatarData.slider[activeCategory].hue;
    satSlider.value = avatarData.slider[activeCategory].sat;
    valSlider.value = avatarData.slider[activeCategory].val;
  } else {
    // Defaults for the active slider UI.
    hueSlider.value = 0;
    satSlider.value = 100;
    valSlider.value = 100;
  }
}

/**
 * Helper: Returns the folder path for a given category.
 */
function getFolderPath(category) {
  if (["Bases", "Eyes", "Hair", "Mouths"].includes(category)) {
    return `sprites/${category}/`;
  } else if (["Bottom", "Eyewear", "Gloves", "Hats", "Shoes", "Top"].includes(category)) {
    return `sprites/Clothing/${category}/`;
  }
  return "";
}

/**
 * Load an image for the given category key (e.g. "Bases", "Top", "Hair")
 * from its folder.
 */
function loadImage(categoryKey, fileName, folderPath) {
  const img = new Image();
  img.src = folderPath + fileName;
  img.onload = function () {
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
 * Remove (clear) a sprite for a given category.
 */
function removeSprite(category) {
  delete currentImages[category];
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  if (avatarData.selectedSprites && avatarData.selectedSprites[category]) {
    delete avatarData.selectedSprites[category];
    localStorage.setItem("avatarData", JSON.stringify(avatarData));
  }
  drawComposite();
}

/**
 * Populate the thumbnail slider for the active category.
 * For removable categories (Hair and Clothing sub‑categories), a “Remove” option is added.
 */
function populateThumbnails(activeCategory) {
  let files = [];
  let folderPath = "";
  
  // Determine files and folder path.
  if (["Bases", "Eyes", "Hair", "Mouths"].includes(activeCategory)) {
    files = spritesManifest[activeCategory] || [];
    folderPath = `sprites/${activeCategory}/`;
  } else if (["Bottom", "Eyewear", "Gloves", "Hats", "Shoes", "Top"].includes(activeCategory)) {
    if (spritesManifest["Clothing"]) {
      files = spritesManifest["Clothing"][activeCategory] || [];
      folderPath = `sprites/Clothing/${activeCategory}/`;
    }
  }
  
  // Clear previous thumbnails.
  thumbsContainer.innerHTML = "";
  
  // For removable categories, add a “Remove” thumbnail.
  if (["Hair", "Bottom", "Eyewear", "Gloves", "Hats", "Shoes", "Top"].includes(activeCategory)) {
    const removeThumb = document.createElement("div");
    removeThumb.classList.add("remove-thumb");
    removeThumb.textContent = "Remove";
    removeThumb.addEventListener("click", () => {
      // Clear any previous selection.
      thumbsContainer.querySelectorAll("img, .remove-thumb").forEach(el => el.classList.remove("selected"));
      removeThumb.classList.add("selected");
      removeSprite(activeCategory);
    });
    thumbsContainer.appendChild(removeThumb);
  }
  
  // Create thumbnails for each file.
  files.forEach(file => {
    const imgThumb = document.createElement("img");
    imgThumb.src = folderPath + file;
    imgThumb.alt = file;
    imgThumb.addEventListener("click", () => {
      // Remove selection highlighting from all thumbnails.
      thumbsContainer.querySelectorAll("img, .remove-thumb").forEach(el => el.classList.remove("selected"));
      imgThumb.classList.add("selected");
      loadImage(activeCategory, file, folderPath);
    });
    thumbsContainer.appendChild(imgThumb);
  });
  
  // Auto-select a saved sprite (or the first option) if available.
  if (files.length > 0 || (["Hair", "Bottom", "Eyewear", "Gloves", "Hats", "Shoes", "Top"].includes(activeCategory))) {
    let saved = getSavedSpriteForCategory(activeCategory);
    let thumb;
    if (saved && files.includes(saved)) {
      thumb = thumbsContainer.querySelector(`img[alt="${saved}"]`);
    }
    if (!thumb && thumbsContainer.querySelector("img, .remove-thumb")) {
      thumb = thumbsContainer.querySelector("img, .remove-thumb");
    }
    if (thumb) {
      thumb.classList.add("selected");
      if (thumb.tagName.toLowerCase() === "img") {
        loadImage(activeCategory, thumb.alt, folderPath);
      } else {
        removeSprite(activeCategory);
      }
    }
  }
}

/**
 * Convert HSV (h in [0,360], s and v in [0,1]) to an RGB object.
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
 * Using "multiply" preserves the image’s shading.
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
 * Draw the composite avatar.
 * Every layer in the defined layering order is drawn if an image is available.
 * For each layer, if slider values have been saved they are applied via tinting.
 * The active category uses the current UI slider values.
 */
function drawComposite() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Define layering order (adjust as needed).
  const layeringOrder = [
    "Bases",
    "Bottom",   // Clothing sub-category
    "Top",      // Clothing sub-category
    "Hair",
    "Eyes",
    "Mouths",
    "Hats",     // Clothing sub-category
    "Eyewear",  // Clothing sub-category
    "Gloves",   // Clothing sub-category
    "Shoes"     // Clothing sub-category
  ];
  
  const activeCategory = getActiveCategory();
  
  layeringOrder.forEach(layer => {
    const img = currentImages[layer];
    if (img && img.complete && img.naturalWidth !== 0) {
      // Use current UI slider values if layer is active; otherwise, use saved values or defaults.
      let sliderSettings;
      if (layer === activeCategory) {
        sliderSettings = {
          hue: hueSlider.value,
          sat: satSlider.value,
          val: valSlider.value
        };
        hueValue.textContent = sliderSettings.hue;
        satValue.textContent = sliderSettings.sat;
        valValue.textContent = sliderSettings.val;
      } else {
        let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
        sliderSettings = (avatarData.slider && avatarData.slider[layer]) || { hue: 0, sat: 0, val: 100 };
      }
      
      const hue = parseInt(sliderSettings.hue, 10);
      const sat = parseFloat(sliderSettings.sat) / 100;
      const val = parseFloat(sliderSettings.val) / 100;
      const rgb = hsvToRgb(hue, sat, val);
      const tintColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      
      // Draw the layer using a tinted canvas.
      const tinted = getTintedCanvas(img, canvas.width, canvas.height, tintColor);
      ctx.drawImage(tinted, 0, 0, canvas.width, canvas.height);
    }
  });
}

/**
 * Load all layers (across the layering order) from saved storage.
 * For each category with a saved sprite, load it so that it appears in the composite.
 */
function loadAllLayersFromStorage() {
  const allCategories = ["Bases", "Bottom", "Top", "Hair", "Eyes", "Mouths", "Hats", "Eyewear", "Gloves", "Shoes"];
  
  allCategories.forEach(category => {
    const saved = getSavedSpriteForCategory(category);
    if (saved) {
      const folderPath = getFolderPath(category);
      loadImage(category, saved, folderPath);
    }
  });
}

/**
 * Initialize the UI: attach event listeners, load saved settings,
 * update the active category’s thumbnails, and load all saved layers.
 */
function init() {
  // When the category changes, show/hide the clothing sub-dropdown.
  sectionSelect.addEventListener("change", () => {
    clothingSubsection.style.display = sectionSelect.value === "Clothing" ? "inline" : "none";
    loadAvatarData();
    populateThumbnails(getActiveCategory());
    drawComposite();
    for (let i = 5; i < thumbsContainer.children.length; i += 6) {
        const br = document.createElement("br");
        thumbsContainer.children[i].after(br);
    }
  });
  
  // When the clothing sub-category changes.
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
  
  // Load the active category's saved slider values and thumbnails.
  loadAvatarData();
  populateThumbnails(getActiveCategory());
  
  // Load all saved layers from storage so every layer is drawn on load.
  loadAllLayersFromStorage();
  
  // Draw composite initially.
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
