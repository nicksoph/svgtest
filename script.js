
function sineWaveData(numPoints, startX, endX, amplitude, frequency, collapseFactor) {
    let points = [];
    let step = (endX - startX) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
        let x = startX + i * step;
        let y = Math.sin(frequency * x) * amplitude / (1 + (x / collapseFactor) ** 2);
        points.push({ x: x, y: y });
    }
    return points;
    const svgContainer = document.getElementById("svg-container");
}
//                numPoints, startX, endX, amplitude, frequency, collapseFactor
const Points = sineWaveData(200, 0, 6 * Math.PI, 100, 1, 4);

getControl(Points)

function getControl(points) {
    // Check if there are at least two points in the array
    if (points.length < 2) {
        return;
    }

    // Add two points to the start and end of the array
    let startPoint = {
        x: points[0].x - (points[1].x - points[0].x),
        y: points[0].y - (points[1].y - points[0].y),
        tension: 0
    };
    let endPoint = {
        x: points[points.length - 1].x + (points[points.length - 1].x - points[points.length - 2].x),
        y: points[points.length - 1].y + (points[points.length - 1].y - points[points.length - 2].y),
        tension: 0
    };
    points.unshift(startPoint);
    points.push(endPoint);

    // Loop through each point in the array (starting from the second point)
    for (let i = 1; i < points.length - 2; i++) {
        // Calculate the tangent at the current point
        let tangent = {
            x: (points[i + 1].x - points[i - 1].x) / 2,
            y: (points[i + 1].y - points[i - 1].y) / 2
        };

        // Calculate the length of the tangent vector
        let tangentLength = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);

        // If the length of the tangent vector is zero, set it to (1, 0)
        if (tangentLength === 0) {
            tangentLength = 1;
            tangent.x = 1;
        }

        // Normalize the tangent vector
        tangent.x /= tangentLength;
        tangent.y /= tangentLength;

        // Calculate the control points for the current point
        let distance = Math.min(tangentLength * points[i].tension, 50);
        points[i].cp1 = {
            x: points[i].x + tangent.x * distance,
            y: points[i].y + tangent.y * distance
        };
        points[i].cp2 = {
            x: points[i].x - tangent.x * distance,
            y: points[i].y - tangent.y * distance
        };
    }

    // Remove the first and last points from the array (the added points)
    points.shift();
    points.pop();
    return points
}

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

function getSVG2() {
    // Create the SVG element

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "0.2");

    svg.appendChild(line);


    svgContainer.appendChild(svg);

    // Set the initial viewBox
    const setInitialViewBox = () => {
        const containerWidth = svgContainer.clientWidth;
        const containerHeight = svgContainer.clientHeight;
        const aspectRatio = containerWidth / containerHeight;
        const viewBoxHeight = 20;
        const viewBoxWidth = viewBoxHeight * aspectRatio;

        svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    };

    setInitialViewBox();
}
// Initialize the SVG PanZoom library
const panZoomInstance = panzoom(svg, {
    zoomEnabled: true,
    panEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    minZoom: 0.015,
    maxZoom: 1000,
    beforePan: function () {
        // Disable animation during panning to improve performance
        panZoomInstance.disablePanAnimation();
    },
    onPan: function () {
        // Re-enable animation after panning is complete
        panZoomInstance.enablePanAnimation();
    },
    onZoom: function () {
        // Update the viewBox after zooming
        const { x, y } = panZoomInstance.getPan();
        const zoomLevel = panZoomInstance.getZoom();
        const viewBox = svg.getAttribute("viewBox").split(" ");
        const viewBoxWidth = parseFloat(viewBox[2]);
        const viewBoxHeight = parseFloat(viewBox[3]);

        svg.setAttribute("viewBox", `${-x} ${-y} ${viewBoxWidth / zoomLevel} ${viewBoxHeight / zoomLevel}`);
    },
});

// Update the viewBox when the window is resized
//window.addEventListener("resize", setInitialViewBox);

