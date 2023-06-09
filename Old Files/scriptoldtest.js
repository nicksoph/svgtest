// Points is a universally accessible variable, that is added to by the functions
const PI = Math.PI;
var svg = ""
let startTime = 0;
let numSteps = 1000;
let timeStep = 0.01;
const Points = [];
// The DIV that the svg goes into
const svgContainer = document.getElementById("svg-container");
const multi = 1000
const pendulums = [
    {
        axis: 'x',
        amplitude: 1,
        frequency: 3,
        phaseShift: .5,
        damping: 1
    },
    {
        axis: 'y',
        amplitude: 1,
        frequency: 3,
        phaseShift: 0,
        damping: 1
    },
    {
        axis: 'x',
        amplitude: 1,
        frequency: 5,
        phaseShift: 0,
        damping: 1
    },
    {
        axis: 'y',
        amplitude: 1,
        frequency: 5.01,
        phaseShift: 1,
        damping: 1
    }
]
update();
function update() {
    makeData(Points);
    smoothCurve(Points)
    chop(Points)
    svg = draw(Points, svgContainer);
    setInitialViewBox(svg, svgContainer, Points);
    setWindowSize(svg, svgContainer, Points);
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

    createGlobalControls();
    updateSettingsDisplay();
    addPendsCtrl()
    evntBtn()
}

// Add Calculated x,y's to empty Points array
//makeData(Points)

// Add Handle data
//setControl(Points);
//smoothCurve(Points)
// Make svg 
//svg = draw(Points, svgContainer);
// Set the sizes of view
//console.log("88", svg, svgContainer, Points)

// Initialize the SVG PanZoom library
// //const panZoomInstance = panzoom(svg, {
// zoomEnabled: true,
//     panEnabled: true,
//         controlIconsEnabled: true,
//             fit: true,
//                 center: true,
//                     minZoom: 0.015,
//                         maxZoom: 1000,
//                             beforePan: function () {
//                                 // Disable animation during panning to improve performance
//                                 panZoomInstance.disablePanAnimation();
//                             },
// onPan: function () {
//     // Re-enable animation after panning is complete
//     panZoomInstance.enablePanAnimation();
// },
// onZoom: function () {
//     // Update the viewBox after zooming
//     const { x, y } = panZoomInstance.getPan();
//     const zoomLevel = panZoomInstance.getZoom();
//     const viewBox = svg.getAttribute("viewBox").split(" ");
//     const viewBoxWidth = parseFloat(viewBox[2]);
//     const viewBoxHeight = parseFloat(viewBox[3]);
// },
//});

//setInitialViewBox(svg, svgContainer, Points);
//setWindowSize(svg, svgContainer, Points);

// Call the function to create global controls
// createGlobalControls();
// updateSettingsDisplay();
// addPendsCtrl()
// evntBtn()

// makeData()
// setControl(Points);
//  svgContainer.innerHTML = ""
//  var svg = ""
// var svg = draw(Points, svgContainer);
//  setInitialViewBox(svg, svgContainer, Points);




function addPendsCtrl() {
    // Add initial pendulum controls
    for (let i = 0; i < pendulums.length; i++) {
        addPendulumControl(i);
    }
}
function evntBtn() {
    // Add functionality to the "Add Pendulum" button
    document.getElementById('addPendulum').addEventListener('click', () => {
        const newPendulum = {
            axis: 'x',
            amplitude: 1,
            frequency: 1,
            phaseShift: 0,
            damping: 0.996
        };
        pendulums.push(newPendulum);
        addPendulumControl(pendulums.length - 1);
    });
    // Add functionality to the "Remove Pendulum" button
    document.getElementById('removePendulum').addEventListener('click', () => {
        if (pendulums.length > 1) {
            pendulums.pop();
            const pendulumControls = document.getElementById('pendulums');
            pendulumControls.removeChild(pendulumControls.lastChild);
            updateSettingsDisplay();
        } else {
            alert('You must have at least one pendulum.');
        }
    });
    document.getElementById('run').addEventListener('click', () => (update()));
}

function updateSettingsDisplay() {
    const tbody = document.getElementById('pendulumSettings');
    tbody.innerHTML = '';

    pendulums.forEach((pendulum, index) => {
        const row = document.createElement('tr');
        const pendulumNumber = document.createElement('td');
        pendulumNumber.textContent = index + 1;
        row.appendChild(pendulumNumber);

        ['axis', 'amplitude', 'frequency', 'phaseShift', 'damping'].forEach((property) => {
            const cell = document.createElement('td');
            cell.textContent = pendulum[property];
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    document.getElementById('displayStartTime').textContent = startTime;
    document.getElementById('displayNumSteps').textContent = numSteps;
    document.getElementById('displayTimeStep').textContent = timeStep;
};

//Adds {p1: {x: Val, y: Val} } by caclculating point and then multiplying by multi
function sineWaveData(numPoints, startX, endX, amplitude, frequency, collapseFactor) {
    let step = (endX - startX) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
        let x = startX + i * step;
        let y = Math.sin(frequency * x) * amplitude / (1 + (x / collapseFactor) ** 2);
        Points.push({ p1: { x: x * multi, y: y * multi } });
    }
    return;
};

function smoothCurve(Points) {
    const tension = 6
    const result = {};
    for (let i = 1; i < Points.length - 2; i++) {
        const p0 = Points[i - 1];
        const p1 = Points[i];
        const p2 = Points[i + 1];
        const p3 = Points[i + 2];
        Points[i].cp1 = {};
        Points[i].cp2 = {};
        Points[i].cp1.x = p1.p1.x + ((p2.p1.x - p0.p1.x) / tension);
        Points[i].cp1.y = p1.p1.y + ((p2.p1.y - p0.p1.y) / tension);
        Points[i].cp2.x = p2.p1.x - ((p3.p1.x - p1.p1.x) / tension);
        Points[i].cp2.y = p2.p1.y - ((p3.p1.y - p1.p1.y) / tension);
        Points[i].p2 = { x: Points[i + 1].p1.x, y: Points[i + 1].p1.y };
    }
    return Points
};

function chop(Points) {
    Points.shift();
    Points.pop();
    Points.pop();
    return Points
};

function generateControlPoints(index, pointA, pointB, pointC, pointD) {
    // Tension controls the tightness of the curve
    const tension = 0.5;

    // Calculates control points for a curve passing through the current point and next
    const dx1 = pointB.x - pointA.x;
    const dy1 = pointB.y - pointA.y;
    const dx2 = pointC.x - pointB.x;
    const dy2 = pointC.y - pointB.y;
    const dx3 = pointD.x - pointC.x;
    const dy3 = pointD.y - pointC.y;

    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const len3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

    const cp1x = pointB.x + (dx1 * tension * len2) / (len1 + len2);
    const cp1y = pointB.y + (dy1 * tension * len2) / (len1 + len2);
    const cp2x = pointC.x - (dx3 * tension * len2) / (len2 + len3);
    const cp2y = pointC.y - (dy3 * tension * len2) / (len2 + len3);

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
    svgContainer.innerHTML = ""
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
        const d = `M ${p1x} ${p1y} C ${cp1y} ${cp1x}, ${cp2x} ${cp2y}, ${p2x} ${p2y}`;

        path.setAttribute("d", d);
        path.setAttribute("stroke", "Red");
        path.setAttribute("path-width", 0.01);
        path.setAttribute("fill", "none");
        svg.appendChild(path);
    })
    return svg
};

function createSVGElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    return svg;
};

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
};
// Update the viewBox when the window is resized
function setWindowSize(svg, svgContainer, Points) {
    window.addEventListener("resize", () => setInitialViewBox(svg, svgContainer, Points));
};

function createPendulumControl(index) {
    const pendulumControl = document.createElement('div');
    pendulumControl.className = 'pendulum-controls';

    const label = document.createElement('h3');
    label.textContent = `Pendulum ${index + 1}`;
    pendulumControl.appendChild(label);
    const settings = [
        { name: 'axis', type: 'radio', options: ['x', 'y'], default: pendulums[index].axis },
        { name: 'amplitude', type: 'range', min: 0, max: 2, step: 0.01, default: pendulums[index].amplitude },
        { name: 'frequency', type: 'range', min: 0, max: 10, step: 0.01, default: pendulums[index].frequency },
        { name: 'phaseShift', type: 'range', min: -Math.PI, max: Math.PI, step: 0.01, default: pendulums[index].phaseShift },
        { name: 'damping', type: 'range', min: 0, max: 1, step: 0.001, default: pendulums[index].damping }
    ];
    settings.forEach((setting) => {
        const settingLabel = document.createElement('label');
        settingLabel.textContent = `${setting.name}: `;
        pendulumControl.appendChild(settingLabel);

        if (setting.type === 'radio') {
            setting.options.forEach((option) => {
                const radioButton = document.createElement('input');
                radioButton.type = 'radio';
                radioButton.name = `pendulum${index}-${setting.name}`;
                radioButton.value = option;
                radioButton.checked = pendulums[index][setting.name] === option;

                radioButton.addEventListener('change', () => {
                    pendulums[index][setting.name] = option;
                    updateSettingsDisplay();
                });
                const optionLabel = document.createElement('label');
                optionLabel.textContent = option;
                pendulumControl.appendChild(optionLabel);
                pendulumControl.appendChild(radioButton);
            });
        } else {
            const slider = document.createElement('input');
            slider.type = setting.type;
            slider.min = setting.min;
            slider.max = setting.max;
            slider.step = setting.step;
            slider.value = setting.default;

            slider.addEventListener('input', () => {
                pendulums[index][setting.name] = parseFloat(slider.value);
                updateSettingsDisplay();
            });

            pendulumControl.appendChild(slider);
        }

        pendulumControl.appendChild(document.createElement('br'));
    });

    return pendulumControl;
};

function addPendulumControl(index) {
    const pendulumControl = createPendulumControl(index);
    document.getElementById('pendulums').appendChild(pendulumControl);
};

function createGlobalControls() {
    const timestepDiv = document.getElementById('timecontrols');
    timestepDiv.innerHTML = '';
    // Create start time input
    const startTimeLabel = document.createElement('label');
    startTimeLabel.textContent = 'Start Time: ';
    timestepDiv.appendChild(startTimeLabel);

    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'number';
    startTimeInput.id = 'startTime';
    startTimeInput.value = startTime;
    startTimeInput.step = 0.01;
    startTimeInput.addEventListener('input', () => {
        startTime = parseFloat(startTimeInput.value);
    });
    timestepDiv.appendChild(startTimeInput);

    timestepDiv.appendChild(document.createElement('br'));

    // Create number of steps input
    const numStepsLabel = document.createElement('label');
    numStepsLabel.textContent = 'No. of Steps: ';
    timestepDiv.appendChild(numStepsLabel);

    const numStepsInput = document.createElement('input');
    numStepsInput.type = 'number';
    numStepsInput.id = 'numSteps';
    numStepsInput.value = numSteps;
    numStepsInput.min = 1;
    numStepsInput.addEventListener('input', () => {
        numSteps = parseInt(numStepsInput.value);
    });
    timestepDiv.appendChild(numStepsInput);

    timestepDiv.appendChild(document.createElement('br'));

    // Create time step input
    const timeStepLabel = document.createElement('label');
    timeStepLabel.textContent = 'Time Step: ';
    timestepDiv.appendChild(timeStepLabel);

    const timeStepInput = document.createElement('input');
    timeStepInput.type = 'number';
    timeStepInput.id = 'timeStep';
    timeStepInput.value = timeStep;
    timeStepInput.step = 0.001;
    timeStepInput.min = 0.001;
    timeStepInput.addEventListener('input', () => {
        timeStep = parseFloat(timeStepInput.value);
    });
    timestepDiv.appendChild(timeStepInput);
    timestepDiv.appendChild(document.createElement('br'));
};

function makeData(Points) {
    Points.length = 0
    for (i = 0; i < numSteps + 3; i++) {
        time = 0 - timeStep + startTime + (i * timeStep)
        var x = 0
        var y = 0
        pendulums.forEach(pendulum => {
            var pos = getPos(time, pendulum)
            if (pendulum.axis === "x") {
                x += pos
            } else {
                y += pos
            }
        })
        Points.push({ p1: { x: x * multi, y: y * multi } })
    }
    return Points
};
// Calculate the position for a single pendulum object at a given time
function getPos(time, pendulum) {
    const { axis, amplitude, frequency, phaseShift, damping } = pendulum;
    // const exponentialTerm = Math.exp(-damping * time);
    // const cosineTerm = Math.cos(2 * PI * frequency * time + phaseShift);
    const position = amplitude * (Math.exp(-damping * time)) * (Math.cos(2 * PI * frequency * time + phaseShift));
    return position;
}
