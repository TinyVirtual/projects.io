const VERSION = '1.6.0';
console.log(`script.js version ${VERSION}`);

// Global sprites manifest from the JSON file.
let spritesManifest = {};

// Store the current image for each category.
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
 * Save and load global color settings.
 */
function saveGlobalAvatarColor() {
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  avatarData.globalColor = {
    hue: hueSlider.value,
    sat: satSlider.value,
    val: valSlider.value
  };
  localStorage.setItem("avatarData", JSON.stringify(avatarData));
}

function loadGlobalAvatarColor() {
  let avatarData = JSON.parse(localStorage.getItem("avatarData") || "{}");
  if (avatarData.globalColor) {
    hueSlider.value = avatarData.globalColor.hue;
    satSlider.value = avatarData.globalColor.sat;
    valSlider.value = avatarData.globalColor.val;
  } else {
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
  img.onload = function () {
    currentImages[category] = img;
    drawComposite();
    saveSelectedSprite(category, fileName);
  };
  img.onerror = function () {
    console.error("Error loading image", folderPath + fileName);
  };
  return img;
}

/**
 * Populate thumbnails for a given category into the specified container.
 */
function populateThumbnailsForCategory(category, container) {
  let files = [];
  let folderPath = "";

  // Determine the files and folder based on category.
  if (category === "Bases") {
    files = spritesManifest["Bases"] || [];
    folderPath = "sprites/Bases/";
  } else if (category === "Hair") {
    files = spritesManifest["Hair"] || [];
    folderPath = "sprites/Hair/";
  } else if (category === "Eyes") {
    files = spritesManifest["Eyes"] || [];
    folderPath = "sprites/Eyes/";
  } else if (category === "Mouths") {
    files = spritesManifest["Mouths"] || [];
    folderPath = "sprites/Mouths/";
  } else if (["Top", "Bottom", "Eyewear", "Gloves", "Hats", "Shoes"].includes(category)) {
    files = (spritesManifest["Clothing"] && spritesManifest["Clothing"][category]) || [];
    folderPath = `sprites/Clothing/${category}/`;
  }

  // Clear out any previous thumbnails.
  container.innerHTML = "";

  // Create a thumbnail for each file.
  files.forEach(file => {
    const imgThumb = document.createElement("img");
    imgThumb.src = folderPath + file;
    imgThumb.alt = file;
    imgThumb.addEventListener("click", () => {
      // Remove 'selected' from all images in this container.
      container.querySelectorAll("img").forEach(img => img.classList.remove("selected"));
      imgThumb.classList.add("selected");
      loadImage(category, file, folderPath);
    });
    container.appendChild(imgThumb);
  });

  // Auto-select a saved sprite (or the first one) if available.
  if (files.length > 0) {
    let saved = getSavedSpriteForCategory(category);
    let thumb;
    if (saved && files.includes(saved)) {
      thumb = container.querySelector(`img[alt="${saved}"]`);
    }
    if (!thumb) {
      thumb = container.querySelector("img");
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
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
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
 * Draw the composite avatar by layering every category.
 * You can adjust the layering order as needed.
 */
function drawComposite() {
  // Use global slider values.
  const hue = parseInt(hueSlider.value, 10);
  const sat = parseFloat(satSlider.value) / 100;
  const val = parseFloat(valSlider.value) / 100;
  hueValue.textContent = hue;
  satValue.textContent = satSlider.value;
  valValue.textContent = valSlider.value;

  const rgb = hsvToRgb(hue, sat, val);
  const tintColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Define a layering order. (Adjust the order as fits your design.)
  const layeringOrder = [
    "Bases",
    "Bottom",         // clothing bottoms
    "Top",            // clothing tops
    "Hair",
    "Eyes",
    "Mouths",
    "Hats",
    "Eyewear",
    "Gloves",
    "Shoes"
  ];

  layeringOrder.forEach(category => {
    const img = currentImages[category];
    if (img && img.complete && img.naturalWidth !== 0) {
      const tinted = getTintedCanvas(img, canvas.width, canvas.height, tintColor);
      ctx.drawImage(tinted, 0, 0, canvas.width, canvas.height);
    }
  });
}

/**
 * Initialize the UI: load global color settings, populate all category thumbnails,
 * and attach slider event listeners.
 */
function init() {
  loadGlobalAvatarColor();

  // Populate thumbnails for each category using their respective containers.
  populateThumbnailsForCategory("Bases", document.getElementById("thumbs-bases"));
  populateThumbnailsForCategory("Hair", document.getElementById("thumbs-hair"));
  populateThumbnailsForCategory("Eyes", document.getElementById("thumbs-eyes"));
  populateThumbnailsForCategory("Mouths", document.getElementById("thumbs-mouths"));

  // Clothing sub-categories:
  populateThumbnailsForCategory("Top", document.getElementById("thumbs-clothing-top"));
  populateThumbnailsForCategory("Bottom", document.getElementById("thumbs-clothing-bottom"));
  populateThumbnailsForCategory("Hats", document.getElementById("thumbs-clothing-hats"));
  populateThumbnailsForCategory("Gloves", document.getElementById("thumbs-clothing-gloves"));
  populateThumbnailsForCategory("Shoes", document.getElementById("thumbs-clothing-shoes"));
  populateThumbnailsForCategory("Eyewear", document.getElementById("thumbs-clothing-eyewear"));

  // Update composite as slider values change.
  hueSlider.addEventListener("input", () => {
    drawComposite();
    saveGlobalAvatarColor();
  });
  satSlider.addEventListener("input", () => {
    drawComposite();
    saveGlobalAvatarColor();
  });
  valSlider.addEventListener("input", () => {
    drawComposite();
    saveGlobalAvatarColor();
  });

  drawComposite();
}

// Fetch the sprites manifest JSON and initialize after it loads.
fetch("sprites.json")
  .then(response => response.json())
  .then(data => {
    spritesManifest = data;
    init();
  })
  .catch(error => {
    console.error("Error loading sprites manifest:", error);
  });
