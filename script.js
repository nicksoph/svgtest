// Points is a universally accessible variable, that is added to by the functions

var svg = ""
const Time = { numSteps: 1000, timeStep: 0.01, startTime: 0 };
const Points = [];
// The DIV that the svg goes into
const svgContainer = document.getElementById("svg-container");
const multi = 1000
//const Pendulums = []
const Pendulums = [
    {
        axis: 'x',
        amplitude: 1,
        frequency: 3.02,
        phaseShift: 0,
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
const penDefault = {
    axis: 'y',
    amplitude: 1,
    frequency: 3.02,
    phaseShift: 0,
    damping: .9
}

update();
setWindowSize(svg, svgContainer, Points);
createGlobalControls();
evntBtn()


function update() {
    makeData(Points);
    smoothCurve(Points)
    chop(Points)
    svg = draw(Points, svgContainer);
    setViewBox(svg, svgContainer, Points)
    updateTimeDisplay()
    makePendsCtrl()
    updatePendDisplay();
    pendEvt();
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
};

function pendEvt() {
    var pendEvtDiv = document.getElementById("allPendCtrlDiv");
    pendEvtDiv.addEventListener('input', function (event) {
        const target = event.target;
        if (target.type === 'range') {
            const num = parseInt(target.getAttribute('data-index'));
            const property = target.getAttribute('data-property');
            Pendulums[num][property] = parseFloat(target.value);

        } else if (target.type === 'radio') {
            const num = parseInt(target.getAttribute('data-index'));
            const property = 'axis';
            const axis = target.value;
            Pendulums[num][property] = axis;

        }
        updatePendDisplay();
    });
}

function timeEvt() {
    const timeEvtDiv = document.getElementById("timecontrol");
    timeEvtDiv.addEventListener('input', () => {
        updateTimeDisplay()
    });
}

function evntBtn() {
    // Add functionality to the "Add Pendulum" button
    document.getElementById('addPendulum').addEventListener('click', () => {
        Pendulums.push(penDefault);
        update();
    });
    // Add functionality to the "Remove Pendulum" button
    document.getElementById('removePendulum').addEventListener('click', () => {
        if (Pendulums.length > 4) {
            Pendulums.pop();
        } else {
            alert('You must have at least four penduli.');
        }
        update();
    });
    document.getElementById('run').addEventListener('click', () => (update()));
};

function makePendsCtrl() {
    pendulumsDiv = document.getElementById('pendulumsDiv')
    pendulumsDiv.innerHTML = "";
    allPendCtrlDiv = document.createElement('div')
    allPendCtrlDiv.setAttribute('id', 'allPendCtrlDiv')
    pendulumsDiv.appendChild(allPendCtrlDiv)


    for (let i = 0; i < Pendulums.length; i++) {
        let pendulumControl = createPendulumControl(i);
        let pendCtrl = document.createElement('div')
        pendCtrl.setAttribute('id', `pendCtrlDiv${i}`)
        pendCtrl.appendChild(pendulumControl)
        allPendCtrlDiv.appendChild(pendCtrl)
    }
    // Add event listener to the pendulumsDiv
    pendulumsDiv.addEventListener('input', function (event) {
        const target = event.target;
        // Check if the target is a slider (input[type=range])
        if (target.type === 'range') {
            //if (target.tagName === 'INPUT' && target.type === 'range') 
            const num = parseInt(target.getAttribute('data-index'), 10);
            const dproperty = target.getAttribute('data-property');
            Pendulums[num][dproperty] = event.target.value;
            console.log([dproperty])
            // Update the corresponding property in the Pendulums array
            Pendulums[num].dproperty = parseFloat(target.value);
        }
        else if (target.type === 'radio') {
            const num = parseInt(target.getAttribute('data-index'));
            const property = 'axis';
            const axis = target.value;
            Pendulums[num][property] = axis;
        }
        updatePendDisplay()
    })
};

function updatePendDisplay() {
    const tbody = document.getElementById('pendulumSettings');
    tbody.innerHTML = '';

    Pendulums.forEach((pendulum, index) => {
        const row = document.createElement('tr');
        const pendulumNumber = document.createElement('td');
        pendulumNumber.textContent = index;
        row.appendChild(pendulumNumber);

        ['axis', 'amplitude', 'frequency', 'phaseShift', 'damping'].forEach((property) => {
            const cell = document.createElement('td');
            cell.textContent = pendulum[property];
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    })
};

function updateTimeDisplay() {
    document.getElementById('displayStartTime').textContent = Time.startTime;
    document.getElementById('displayNumSteps').textContent = Time.numSteps;
    document.getElementById('displayTimeStep').textContent = Time.timeStep;
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

function draw(Points, svgContainer) {
    svgContainer.innerHTML = ""
    svg = createSVGElement();
    svgContainer.appendChild(svg);
    Points.forEach((line) => {
        const { p1, cp1, cp2, p2 } = line;
        const { x: p1x, y: p1y } = p1;
        const { x: cp1x, y: cp1y } = cp1;
        const { x: cp2x, y: cp2y } = cp2;
        const { x: p2x, y: p2y } = p2;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${p1x} ${p1y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2x} ${p2y}`;

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

function setViewBox(svg, svgContainer, Points) {
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

    //console.log(minX, margin, minY, viewBoxWidth, "vb", viewBoxHeight)

    svg.setAttribute("viewBox", `${minX - margin} ${minY - margin} ${viewBoxWidth} ${viewBoxHeight}`);
};

// Update the viewBox when the window is resized
function setWindowSize(svg, svgContainer, Points) {
    window.addEventListener("resize", () => setViewBox(svg, svgContainer, Points));
};

function createPendulumControl(i) {
    const pendulumControl = document.createElement('div');

    pendulumControl.className = 'pendulum-controls';

    const label = document.createElement('h3');
    label.textContent = `Pendulum ${i}`;
    pendulumControl.appendChild(label);
    const settings = [
        { name: 'axis', type: 'radio', options: ['x', 'y'], default: 'x' },
        { name: 'amplitude', type: 'range', min: 0, max: 1000, step: 0.01, default: Pendulums[0].amplitude },
        { name: 'frequency', type: 'range', min: 0, max: 1000, step: 0.01, default: Pendulums[0].frequency },
        { name: 'phaseShift', type: 'range', min: -Math.PI, max: Math.PI, step: 0.01, default: Pendulums[0].phaseShift },
        { name: 'damping', type: 'range', min: 0, max: 1, step: 0.001, default: Pendulums[0].damping }
    ];
    settings.forEach((setting) => {
        const settingLabel = document.createElement('label');
        settingLabel.textContent = `${setting.name}${i}: `;
        pendulumControl.appendChild(settingLabel);

        if (setting.type === 'radio') {
            setting.options.forEach((option) => {
                const radioButton = document.createElement('input');
                radioButton.type = 'radio';
                radioButton.name = `pendulum${i}-${setting.name}`;
                radioButton.value = option;
                radioButton.checked = Pendulums[i][setting.name] === option;
                radioButton.setAttribute('data-index', i);
                radioButton.setAttribute('data-property', setting.name);

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
            slider.setAttribute('data-index', i);
            slider.setAttribute('data-property', setting.name);
            pendulumControl.appendChild(slider);
        }
        pendulumControl.appendChild(document.createElement('br'));

    });
    return pendulumControl;
}

function createGlobalControls() {
    const timestepDiv = document.getElementById('timecontrols');
    timestepDiv.innerHTML = ""
    // Create start time input
    const startTimeLabel = document.createElement('label');
    startTimeLabel.textContent = 'Start Time: ';
    timestepDiv.appendChild(startTimeLabel);

    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'number';
    startTimeInput.id = 'startTime';
    startTimeInput.value = Time.startTime;
    startTimeInput.step = 0.01;
    startTimeInput.addEventListener('input', () => {
        Time.startTime = parseFloat(startTimeInput.value);
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
    numStepsInput.value = Time.numSteps;
    numStepsInput.min = 1;
    numStepsInput.addEventListener('input', () => {
        Time.numSteps = parseInt(numStepsInput.value);
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
    timeStepInput.value = Time.timeStep;
    timeStepInput.step = 0.001;
    timeStepInput.min = 0.001;
    timeStepInput.addEventListener('input', () => {
        Time.timeStep = parseFloat(timeStepInput.value);
    });
    timestepDiv.appendChild(timeStepInput);

    timestepDiv.appendChild(document.createElement('br'));

};

function makeData(Points) {
    Points.length = 0
    for (i = 0; i < Time.numSteps + 3; i++) {
        var time = Time.startTime - Time.timeStep + (i * Time.timeStep)
        var x = 0
        var y = 0
        Pendulums.forEach(pendulum => {
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
    // const cosineTerm = Math.cos(2 * Math.PI * frequency * time + phaseShift);
    const position = amplitude * (Math.exp(-damping * time)) * (Math.cos(2 * Math.PI * frequency * time + phaseShift));
    return position;
};
//position = amplitude * (Math.exp(-damping * time)) * (Math.cos(2 * PI * frequency * time + phaseShift))

