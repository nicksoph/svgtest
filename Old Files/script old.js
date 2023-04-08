
document.addEventListener("DOMContentLoaded", function () {

    const svgContainer = document.getElementById("svg-container");
    const svg = getSVG()
    svgContainer.appendChild(svg);
    setInitialViewBox(svg);

    function getSVG() {
        // Create the SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("id", "svgId");

        // Add 10 small random lines
        for (let i = 0; i < 10; i++) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", Math.random() * 20);
            line.setAttribute("y1", Math.random() * 20);
            line.setAttribute("x2", Math.random() * 20);
            line.setAttribute("y2", Math.random() * 20);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "0.2");

            svg.appendChild(line);
        }
        return svg
    }

    // Set the initial viewBox
    function setInitialViewBox(svg) {
        const containerWidth = svgContainer.clientWidth;
        const containerHeight = svgContainer.clientHeight;
        const aspectRatio = containerWidth / containerHeight;
        const viewBoxHeight = 20;
        const viewBoxWidth = viewBoxHeight * aspectRatio;
        svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    };



    // Update the viewBox when the window is resized
    window.addEventListener("resize", setInitialViewBox);

    // Add zoom and pan functionality
    let zoomLevel = 1;
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };
    let currentTranslate = { x: 0, y: 0 };
    let isAnimating = false;

    const updateViewBox = () => {
        const viewBox = svg.getAttribute("viewBox").split(" ");
        const viewBoxWidth = parseFloat(viewBox[2]);
        const viewBoxHeight = parseFloat(viewBox[3]);

        svg.setAttribute("viewBox", `${-currentTranslate.x} ${-currentTranslate.y} ${viewBoxWidth} ${viewBoxHeight}`);
        isAnimating = false;
    };


    // Update the viewBox when the window is resized
    window.addEventListener("resize", setInitialViewBox);
});







