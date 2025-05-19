let spritesManifest = {};
let currentImage = new Image();
let currentFileName = "";

const hueSlider = document.getElementById("hueSlider");
const satSlider = document.getElementById("satSlider");
const valSlider = document.getElementById("valSlider");
const hueValue = document.getElementById("hueValue");
const satValue = document.getElementById("satValue");
const valValue = document.getElementById("valValue");

const sectionSelect = document.getElementById("sectionSelect");
const clothingSubsection = document.getElementById("clothingSubsection");
const spriteThumbsContainer = document.getElementById("spriteThumbsContainer");

const selectedSectionSpan = document.getElementById("selectedSection");
const selectedSubsectionSpan = document.getElementById("selectedSubsection");

const canvas = document.getElementById("spriteCanvas");
const ctx = canvas.getContext("2d");

/**
 * Converts HSV (with s and v between 0 and 1) to HSL.
 */
function hsvToHsl(h, s, v) {
  let l = (2 - s) * v / 2;
  let newS = (s * v) / (l <= 1 ? l : 2 - l);
  if (isNaN(newS)) newS = 0;
  return { h: h, s: newS * 100, l: l * 100 };
}

/**
 * Update the text above the thumbnails to show the selected category (and subcategory).
 */
function updateSelectedInfo() {
  const section = sectionSelect.value;
  selectedSectionSpan.textContent = section;
  if (section === "Clothing") {
    selectedSubsectionSpan.textContent = clothingSubsection.value;
  } else {
    selectedSubsectionSpan.textContent = "";
  }
}

/**
 * Build the thumbnail “slider” based on the current selection.
 */
function updateSpriteThumbnails() {
  updateSelectedInfo();
  
  const section = sectionSelect.value;
  let spriteFiles = [];
  
  if (section === "Clothing") {
    spriteFiles = spritesManifest["Clothing"][clothingSubsection.value] || [];
  } else {
    spriteFiles = spritesManifest[section] || [];
  }
  
  // Clear any existing thumbnails
  spriteThumbsContainer.innerHTML = "";
  
  spriteFiles.forEach(file => {
    const img = document.createElement("img");
    let folderPath = "";
    if (section === "Clothing") {
      folderPath = `sprites/Clothing/${clothingSubsection.value}/`;
    } else {
      folderPath = `sprites/${section}/`;
    }
    img.src = folderPath + file;
    img.alt = file;
    
    // When a thumbnail is clicked, load that sprite and highlight it.
    img.addEventListener("click", () => {
      currentFileName = file;
      loadSprite(file);
      
      // Remove "selected" class from all thumbnails and add to the clicked one.
      spriteThumbsContainer.querySelectorAll("img").forEach(thumb => thumb.classList.remove("selected"));
      img.classList.add("selected");
    });
    
    spriteThumbsContainer.appendChild(img);
  });
  
  // If available, load the first sprite by default.
  if (spriteFiles.length > 0) {
    const firstThumbnail = spriteThumbsContainer.querySelector("img");
    if (firstThumbnail) {
      firstThumbnail.classList.add("selected");
    }
    currentFileName = spriteFiles[0];
    loadSprite(spriteFiles[0]);
  } else {
    clearCanvas();
  }
}

/**
 * Load a sprite image based on the current category selection.
 */
function loadSprite(fileName) {
  const section = sectionSelect.value;
  let folderPath = "";
  
  if (section === "Clothing") {
    folderPath = `sprites/Clothing/${clothingSubsection.value}/`;
  } else {
    folderPath = `sprites/${section}/`;
  }
  
  currentImage = new Image();
  currentImage.src = folderPath + fileName;
  
  currentImage.onload = () => {
    drawSprite();
  };
  
  currentImage.onerror = () => {
    console.error("Failed to load sprite:", currentImage.src);
    clearCanvas();
  };
}

/**
 * Clear the canvas.
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw the current sprite with the tint overlay from the slider values.
 * This function checks if the image is fully loaded.
 */
function drawSprite() {
  if (!currentImage || !currentImage.complete || currentImage.naturalWidth === 0) {
    return;
  }
  
  const hue = parseInt(hueSlider.value, 10);
  const sat = parseFloat(satSlider.value) / 100;
  const val = parseFloat(valSlider.value) / 100;
  
  hueValue.textContent = hue;
  satValue.textContent = satSlider.value;
  valValue.textContent = valSlider.value;
  
  const hsl = hsvToHsl(hue, sat, val);
  const tintColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  
  clearCanvas();
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
  
  // Apply a tint to non-transparent pixels
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = tintColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

/**
 * Initialize event listeners and set up the UI.
 */
function init() {
  sectionSelect.addEventListener("change", () => {
    if (sectionSelect.value === "Clothing") {
      clothingSubsection.style.display = "inline";
    } else {
      clothingSubsection.style.display = "none";
    }
    updateSpriteThumbnails();
  });
  
  clothingSubsection.addEventListener("change", updateSpriteThumbnails);
  
  hueSlider.addEventListener("input", drawSprite);
  satSlider.addEventListener("input", drawSprite);
  valSlider.addEventListener("input", drawSprite);
  
  // Build the initial thumbnails and load the first sprite.
  updateSpriteThumbnails();
}

// Fetch the sprite manifest and then initialize.
fetch("sprites.json")
  .then(response => response.json())
  .then(data => {
    spritesManifest = data;
    init();
  })
  .catch(error => {
    console.error("Error loading sprites manifest:", error);
  });
