document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.getElementById("imageInput");
    const imageCanvas = document.getElementById("imageCanvas");
    const colorCodeDisplay = document.getElementById("colorCodeDisplay");
    const errorMessage = document.getElementById("errorMessage");

    imageInput.addEventListener("change", function() {
        const file = imageInput.files[0];

        if (!file) {
            errorMessage.textContent = "Please select an image.";
            return;
        } else {
            errorMessage.textContent = "";
        }

        const reader = new FileReader();

        reader.onload = function() {
            const img = new Image();

            img.onload = function() {
                const maxCanvasSize = 500;
                let canvasWidth = img.width;
                let canvasHeight = img.height;

                if (canvasWidth > maxCanvasSize || canvasHeight > maxCanvasSize) {
                    const aspectRatio = canvasWidth / canvasHeight;
                    if (aspectRatio > 1) {
                        canvasWidth = maxCanvasSize;
                        canvasHeight = maxCanvasSize / aspectRatio;
                    } else {
                        canvasWidth = maxCanvasSize * aspectRatio;
                        canvasHeight = maxCanvasSize;
                    }
                }

                imageCanvas.width = canvasWidth;
                imageCanvas.height = canvasHeight;

                const ctx = imageCanvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

                imageCanvas.addEventListener("click", function(e) {
                    const x = e.offsetX;
                    const y = e.offsetY;
                    const pixel = ctx.getImageData(x, y, 1, 1).data;

                    const colorCode = rgbToHex(pixel[0], pixel[1], pixel[2]);
                    colorCodeDisplay.textContent = "Color Code: " + colorCode;
                });
            };

            img.src = reader.result;
        };

        reader.readAsDataURL(file);
    });
});

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
