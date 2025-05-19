let spritesManifest = {};
// Store the currently selected Image for each layer
const currentImages = {
  "Bases": null,
  "Clothing": null,
  "Eyes": null,
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
const thumbsMouths = document.getElementById("thumbs-mouths");

/**
 * Load an image for a given layer from the provided folder
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
 * The tint is applied with a multiply composite so that shading is preserved.
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
 * Draw all layers (Bases, Clothing, Eyes, Mouths) onto the main canvas.
 * The global sliders set a tint color that is applied using a color multiplier.
 */
function drawComposite() {
  // Update slider display values.
  const hue = parseInt(hueSlider.value, 10);
  const sat = parseFloat(satSlider.value) / 100;
  const val = parseFloat(valSlider.value) / 100;
  hueValue.textContent = hue;
  satValue.textContent = satSlider.value;
  valValue.textContent = valSlider.value;

  // Convert the HSV slider values to an RGB color.
  const rgb = hsvToRgb(hue, sat, val);
  const tintColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // Clear the main canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw layers in order: Bases, Clothing, Eyes, Mouths.
  const layers = ["Bases", "Clothing", "Eyes", "Mouths"];
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
 * Once the manifest is loaded, initialize the UI and populate each layer’s thumbnails.
 */
function init() {
  populateThumbnails("Bases");
  populateThumbnails("Clothing");
  populateThumbnails("Eyes");
  populateThumbnails("Mouths");

  // Update Clothing thumbnails when its subcategory changes.
  clothingSubsection.addEventListener("change", () => {
    populateThumbnails("Clothing");
  });

  // Update composite when sliders change.
  hueSlider.addEventListener("input", drawComposite);
  satSlider.addEventListener("input", drawComposite);
  valSlider.addEventListener("input", drawComposite);
}

// Fetch the sprites manifest and then initialize the UI.
fetch("sprites.json")
  .then(response => response.json())
  .then(data => {
    spritesManifest = data;
    init();
  })
  .catch(error => {
    console.error("Error loading sprites manifest:", error);
  });
