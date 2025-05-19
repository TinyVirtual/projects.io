let spritesManifest = {};
const currentImages = {
  "Bases": null,
  "Clothing": null,
  "Eyes": null,
  "Hair": null,
  "Mouths": null
};

// Get canvas and slider elements
const canvas = document.getElementById("spriteCanvas");
const ctx = canvas.getContext("2d");

const hueSlider = document.getElementById("hueSlider");
const satSlider = document.getElementById("satSlider");
const valSlider = document.getElementById("valSlider");

const hueValue = document.getElementById("hueValue");
const satValue = document.getElementById("satValue");
const valValue = document.getElementById("valValue");

const clothingSubsection = document.getElementById("clothingSubsection");

// Get thumbnail container elements for each layer
const thumbsBases = document.getElementById("thumbs-bases");
const thumbsClothing = document.getElementById("thumbs-clothing");
const thumbsEyes = document.getElementById("thumbs-eyes");
const thumbsHair = document.getElementById("thumbs-hair");
const thumbsMouths = document.getElementById("thumbs-mouths");

/**
 * Load an image for a given layer from the provided folder.
 */
function loadImage(layer, fileName, folderPath) {
  const img = new Image();
  img.src = folderPath + fileName;
  img.onload = function() {
    currentImages[layer] = img;
    drawComposite();
  };
  img.onerror = function() {
    console.error("Error loading image", folderPath + fileName);
  };
  return img;
}

/**
 * Populate the thumbnail slider for the specified layer.
 * For Clothing, it uses the currently selected subcategory.
 */
function populateThumbnails(layer) {
  let container, files = [], folderPath = "";
  switch (layer) {
    case "Bases":
      container = thumbsBases;
      files = spritesManifest["Bases"] || [];
      folderPath = "sprites/Bases/";
      break;
    case "Clothing":
      container = thumbsClothing;
      const subcat = clothingSubsection.value;
      files = (spritesManifest["Clothing"] && spritesManifest["Clothing"][subcat]) || [];
      folderPath = `sprites/Clothing/${subcat}/`;
      break;
    case "Eyes":
      container = thumbsEyes;
      files = spritesManifest["Eyes"] || [];
      folderPath = "sprites/Eyes/";
      break;
    case "Hair":
      container = thumbsHair;
      files = spritesManifest["Hair"] || [];
      folderPath = "sprites/Hair/";
      break;
    case "Mouths":
      container = thumbsMouths;
      files = spritesManifest["Mouths"] || [];
      folderPath = "sprites/Mouths/";
      break;
    default:
      break;
  }

  // Clear previous thumbnails
  container.innerHTML = "";

  files.forEach(file => {
    const imgThumb = document.createElement("img");
    imgThumb.src = folderPath + file;
    imgThumb.alt = file;
    imgThumb.addEventListener("click", () => {
      // Remove 'selected' class from all images in the container
      container.querySelectorAll("img").forEach(img => img.classList.remove("selected"));
      imgThumb.classList.add("selected");
      loadImage(layer, file, folderPath);
    });
    container.appendChild(imgThumb);
  });

  // Auto-select the first thumbnail if available
  if (files.length > 0) {
    const firstThumb = container.querySelector("img");
    if (firstThumb) {
      firstThumb.classList.add("selected");
      loadImage(layer, files[0], folderPath);
    }
  }
}

/**
 * Converts HSV (with h in [0,360] and s, v in [0,1]) to an RGB object.
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
  offCtx.globalCompositeOperation = "source-over"; // Reset composite
  return off;
}

/**
 * Draw all layers (Bases, Clothing, Eyes, Hair, Mouths) onto the main canvas.
 */
function drawComposite() {
  // Convert the HSV slider values to an RGB color.
  const hue = parseInt(hueSlider.value, 10);
  const sat = parseFloat(satSlider.value) / 100;
  const val = parseFloat(valSlider.value) / 100;
  const rgb = hsvToRgb(hue, sat, val);
  const tintColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // Clear the main canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw layers in order: Bases, Clothing, Eyes, Hair, Mouths.
  const layers = ["Bases", "Clothing", "Eyes", "Hair", "Mouths"];
  layers.forEach(layer => {
    const img = currentImages[layer];
    if (img && img.complete && img.naturalWidth !== 0) {
      // Create a tinted version using our multiplier method.
      const tinted = getTintedCanvas(img, canvas.width, canvas.height, tintColor);
      ctx.drawImage(tinted, 0, 0, canvas.width, canvas.height);
    }
  });
}

/**
 * Initialize the UI and populate thumbnails for all layers.
 */
function init() {
  populateThumbnails("Bases");
  populateThumbnails("Clothing");
  populateThumbnails("Eyes");
  populateThumbnails("Hair");
  populateThumbnails("Mouths");

  clothingSubsection.addEventListener("change", () => {
    populateThumbnails("Clothing");
  });

  hueSlider.addEventListener("input", drawComposite);
  satSlider.addEventListener("input", drawComposite);
  valSlider.addEventListener("input", drawComposite);
}

// Fetch the sprites manifest and initialize the UI.
fetch("sprites.json")
  .then(response => response.json())
  .then(data => {
    spritesManifest = data;
    init();
  })
  .catch(error => {
    console.error("Error loading sprites manifest:", error);
  });
console.log("v 1.5.1")
