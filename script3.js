function sineWaveData(numPoints, startX, endX, amplitude, frequency, collapseFactor) {
    let points = [];
    let step = (endX - startX) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
        let x = startX + i * step;
        let y = Math.sin(frequency * x) * amplitude / (1 + (x / collapseFactor) ** 2);
        points.push({ x: x, y: y });
    }
    return points;
}

// does nothing 
function getControl(points) {
    // The existing code in the getControl function.
    // ...
    return points;
}

function createSVGElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    return svg;
}

function createLineElement(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "0.2");
    return line;
}

// function setInitialViewBox(svg, svgContainer) {
//     const containerWidth = svgContainer.clientWidth;
//     const containerHeight = svgContainer.clientHeight;
//     const aspectRatio = containerWidth / containerHeight;
//     const viewBoxHeight = 20;
//     const viewBoxWidth = viewBoxHeight * aspectRatio;

//     svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
// }

function setInitialViewBox(svg, svgContainer, points) {
    const margin = 10;
    const [minX, maxX, minY, maxY] = points.reduce(
        (acc, point) => [
            Math.min(acc[0], point.x),
            Math.max(acc[1], point.x),
            Math.min(acc[2], point.y),
            Math.max(acc[3], point.y),
        ],
        [Infinity, -Infinity, Infinity, -Infinity]
    );

    const contentWidth = maxX - minX + 2 * margin;
    const contentHeight = maxY - minY + 2 * margin;

    const containerWidth = svgContainer.clientWidth;
    const containerHeight = svgContainer.clientHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    const contentAspectRatio = contentWidth / contentHeight;
    let viewBoxWidth, viewBoxHeight;

    if (containerAspectRatio > contentAspectRatio) {
        viewBoxHeight = contentHeight;
        viewBoxWidth = contentHeight * containerAspectRatio;
    } else {
        viewBoxWidth = contentWidth;
        viewBoxHeight = contentWidth / containerAspectRatio;
    }

    svg.setAttribute("viewBox", `${minX - margin} ${minY - margin} ${viewBoxWidth} ${viewBoxHeight}`);
}

function main() {
    const points = sineWaveData(30, 0, 6 * Math.PI, 100, 1, 8);
    const controlledPoints = getControl(points);

    const svgContainer = document.getElementById("svg-container");
    const svg = createSVGElement();
    svgContainer.appendChild(svg);

    // Add lines to the SVG element using the controlledPoints array
    for (let i = 0; i < controlledPoints.length - 1; i++) {
        const point1 = controlledPoints[i];
        const point2 = controlledPoints[i + 1];

        const line = createLineElement(point1.x, point1.y, point2.x, point2.y);
        svg.appendChild(line);
    }

    setInitialViewBox(svg, svgContainer, controlledPoints);

    // Initialize the SVG PanZoom library
    const panZoomInstance = panzoom(svg, {
        // The existing configuration for the panzoom library.
        // ...
    });

    // Update the viewBox when the window is resized
    //window.addEventListener("resize", () => setInitialViewBox(svg, svgContainer, controlledPoints));
}

main();


    // Update the viewBox when the window is resized
    //window.addEventListener("resize", () => setInitialViewBox(svg, svgContainer));



