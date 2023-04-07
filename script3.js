// Points is a universally accessable variable 

// imaginary and is an array of objects which each contain information about drawing an item
// Here the information begins with a series of x,y Pointss to which information about the next Points and the Pointss of handles that are used to create smooth lines.


const svgContainer = document.getElementById("svg-container");
function main() {
    // make Points
    sineWaveData(70, 0, 6 * Math.PI, 100, 1, 8);
    // add Handle data
    getControl(Points);

    const svgContainer = document.getElementById("svg-container");

    const svg = draw(Points)
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
    setWindowSize(svg, svgContainer, Points)
}
function getControl(Points) {
    // Estimate imaginary Points before and after the line
    let imaginaryStart1 = {
        x: 2 * Points[0].x - Points[1].x,
        y: 2 * Points[0].y - Points[1].y
    };

    let imaginaryEnd1 = {
        x: 2 * Points[Points.length - 1].x - Points[Points.length - 2].x,
        y: 2 * Points[Points.length - 1].y - Points[Points.length - 2].y
    };

    // Explicitly calculate control Points for the first real point
    generateControlPoints(0, imaginaryStart1, Points[0], Points[1], Points[2])
    for (i = 1; i < Points.length - 1; i++) {
        generateControlPoints(i, Points[i - 1], Points[i], Points[i + 1, Points[i + 2]])
    }
    generateControlPoints(i, Points[i - 1], Points[i], Points[i + 1], imaginaryEnd1)
    generateControlPoints(i + 1, Points[i], Points[i + 1], imaginaryEnd1, imaginaryEnd1)

}
const svg = draw(Points)
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
setWindowSize(svg, svgContainer, Points)


function generateControlPoints(index, pointA, pointB, pointC, pointD) {
    // Tension controls the tightness of the curve
    const tension = 0.5;

    // Calculates control points for a curve passing through the current point and next
    function calculateControlPoints(index, prevPoint, curPoint, nextPoint, afterNextPoint) {
        const dx1 = curPoint.x - prevPoint.x;
        const dy1 = curPoint.y - prevPoint.y;
        const dx2 = nextPoint.x - curPoint.x;
        const dy2 = nextPoint.y - curPoint.y;

        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        const cp1x = curPoint.x + (dx1 * tension * len1) / (len1 + len2);
        const cp1y = curPoint.y + (dy1 * tension * len1) / (len1 + len2);
        const cp2x = curPoint.x - (dx2 * tension * len2) / (len1 + len2);
        const cp2y = curPoint.y - (dy2 * tension * len2) / (len1 + len2);

        Points[index].cp1.x = cp1x
        Points[index].cp1.y = cp1y
        Points[index].cp2.x = cp2x
        Points[index].cp2.y = cp2y
        console.log(points[index])
    }

    // // Calculate control points for pointB and pointC
    // const pointBControlPoints = calculateControlPoints(pointA, pointB, pointC, pointD);
    // const pointCControlPoints = calculateControlPoints(pointB, pointC, pointD, pointA);

    // return {
    //     pointB: pointBControlPoints,
    //     pointC: pointCControlPoints,
    // };
}




const Points = []
function sineWaveData(numPoints, startX, endX, amplitude, frequency, collapseFactor) {
    let step = (endX - startX) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
        let x = startX + i * step;
        let y = Math.sin(frequency * x) * amplitude / (1 + (x / collapseFactor) ** 2);
        Points.push({ x: x, y: y });
    }
    return;
}

const svg = draw(Points)
setInitialViewBox(svg, svgContainer, Points);






function createSVGElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    return svg;
}





function draw(Points) {
    const svgContainer = document.getElementById("svg-container");
    const svg = createSVGElement();
    svgContainer.appendChild(svg);

    console.log(Points)
    Points.forEach((line) => {
        const { x, y, cp1x, cp1y, cp2x, cp2y, x2, y2 } = line;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${x} ${y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "black");
        path.setAttribute("path-width", 0.1);
        path.setAttribute("fill", "none");
        svg.appendChild(path);
    })
    return svg
}

// function draw(Points) {
//     const svgContainer = document.getElementById("svg-container");
//     const svg = createSVGElement();
//     svgContainer.appendChild(svg);
//     // Add lines to the SVG element using the controlledPoints array
//     for (let i = 0; i < Points.length - 1; i++) {
//         const point1 = Points[i];
//         const point2 = Points[i + 1];

//         const line = createLineElement(point1.x, point1.y, point2.x, point2.y);
//         svg.appendChild(line);
//     }
//     return svg
// }

function setInitialViewBox(svg, svgContainer, Points) {
    if (!Points || Points.length === 0) {
        console.error('Empty or undefined Points array');
        return;
    }

    const margin = 10;
    const [minX, maxX, minY, maxY] = Points.reduce(
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



// Update the viewBox when the window is resized
function setWindowSize(svg, svgContainer, Points) {
    window.addEventListener("resize", () => setInitialViewBox(svg, svgContainer, Points));
}
main();





