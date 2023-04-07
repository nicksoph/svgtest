// Points is a universally accessible variable, that is added to by the functions
const Points = [];
// The DIV that the svg goes into
const svgContainer = document.getElementById("svg-container");

main()

function main() {
    // Add Calculated x,y's to empty Points array
    sineWaveData(500, 0, 50 * Math.PI, 100, 1, 20);
    // Add Handle data
    setControl(Points);
    // Make svg 
    const svg = draw(Points, svgContainer);
    // Set the sizes of view
    setInitialViewBox(svg, svgContainer, Points);
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
        },
    });
    //dont know
    setWindowSize(svg, svgContainer, Points);
}

function sineWaveData(numPoints, startX, endX, amplitude, frequency, collapseFactor) {
    let step = (endX - startX) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
        let x = startX + i * step;
        let y = Math.sin(frequency * x) * amplitude / (1 + (x / collapseFactor) ** 2);
        Points.push({ p1: { x: x, y: y } });
    }
    return;
}

function setControl(Points) {
    // Estimate imaginary points before and after the line
    let imaginaryStart1 = {
        x: 2 * Points[0].p1.x - Points[1].p1.x,
        y: 2 * Points[0].p1.y - Points[1].p1.y,
    };

    let imaginaryEnd1 = {
        x: 2 * Points[Points.length - 1].p1.x - Points[Points.length - 2].p1.x,
        y: 2 * Points[Points.length - 1].p1.y - Points[Points.length - 2].p1.y,
    };

    // Explicitly calculate control points for the first real point
    generateControlPoints(0, imaginaryStart1, Points[0].p1, Points[1].p1, Points[2].p1);
    for (i = 1; i < Points.length - 2; i++) {
        generateControlPoints(i, Points[i - 1].p1, Points[i].p1, Points[i + 1].p1, Points[i + 2].p1);
    }

    generateControlPoints(Points.length - 2, Points[Points.length - 3].p1, Points[Points.length - 2].p1, Points[Points.length - 1].p1, imaginaryEnd1);
}

function generateControlPoints(index, pointA, pointB, pointC, pointD) {
    // Tension controls the tightness of the curve
    const tension = 0.5;

    // Calculates control points for a curve passing through the current point and next
    const dx1 = pointB.x - pointA.x;
    const dy1 = pointB.y - pointA.y;
    const dx2 = pointC.x - pointB.x;
    const dy2 = pointC.y - pointB.y;

    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const cp1x = pointB.x + (dx1 * tension * len1) / (len1 + len2);
    const cp1y = pointB.y + (dy1 * tension * len1) / (len1 + len2);
    const cp2x = pointB.x - (dx2 * tension * len2) / (len1 + len2);
    const cp2y = pointB.y - (dy2 * tension * len2) / (len1 + len2);

    // Update control points
    Points[index].cp1 = { x: cp1x, y: cp1y };
    Points[index].cp2 = { x: cp2x, y: cp2y };

    if (Points[index + 1]) {
        Points[index].p2 = { x: Points[index + 1].p1.x, y: Points[index + 1].p1.y };
    } else {
        Points[index].p2 = { x: Points[index].p1.x, y: Points[index].p1.y };
    };
};

function draw(Points, svgContainer) {
    const svg = createSVGElement();
    svgContainer.appendChild(svg);
    var xxx = -1

    Points.forEach((line) => {

        const { p1, cp1, cp2, p2 } = line;

        if (!p2) { return }
        const { x: p1x, y: p1y } = p1;
        const { x: cp1x, y: cp1y } = cp1;
        const { x: cp2x, y: cp2y } = cp2;
        const { x: p2x, y: p2y } = p2;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${p1x} ${p1y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2x} ${p2y}`;

        path.setAttribute("d", d);
        path.setAttribute("stroke", "Red");
        path.setAttribute("path-width", 0.01);
        path.setAttribute("fill", "none");
        svg.appendChild(path);
    })
    return svg
}

function createSVGElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    return svg;
}

function setInitialViewBox(svg, svgContainer, Points) {

    const margin = 10;
    const [minX, maxX, minY, maxY] = Points.reduce(
        (acc, point) => [
            Math.min(acc[0], point.p1.x),
            Math.max(acc[1], point.p1.x),
            Math.min(acc[2], point.p1.y),
            Math.max(acc[3], point.p1.y),
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
// Update the viewBox when the window is resized
function setWindowSize(svg, svgContainer, Points) {
    window.addEventListener("resize", () => setInitialViewBox(svg, svgContainer, Points));
}
