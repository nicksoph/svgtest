
const pendulums = [
    {
        axis: 'x',
        amplitude: 1,
        frequency: 1,
        phaseShift: 0,
        damping: 0.996
    },
    {
        axis: 'y',
        amplitude: 1,
        frequency: 2,
        phaseShift: 0,
        damping: 0.996
    },
    // Add two more pendulums with default settings
    {
        axis: 'x',
        amplitude: 1,
        frequency: 1,
        phaseShift: 0,
        damping: 0.996
    },
    {
        axis: 'y',
        amplitude: 1,
        frequency: 2,
        phaseShift: 0,
        damping: 0.996
    }
];

function createPendulumControl(index) {
    const pendulumControl = document.createElement('div');
    pendulumControl.className = 'pendulum-controls';

    const label = document.createElement('h3');
    label.textContent = `Pendulum ${index + 1}`;
    pendulumControl.appendChild(label);

    // Create control elements (sliders and radio buttons) for each setting
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
            });

            pendulumControl.appendChild(slider);
        }

        pendulumControl.appendChild(document.createElement('br'));
    });

    return pendulumControl;
}

function addPendulumControl(index) {
    const pendulumControl = createPendulumControl(index);
    document.getElementById('pendulums').appendChild(pendulumControl);
}

// Variables for start time, number of steps, and step size in time
let startTime = 0;
let numSteps = 1000;
let timeStep = 0.01;

function createGlobalControls() {
    const pendulumsDiv = document.getElementById('pendulums');

    // Create start time input
    const startTimeLabel = document.createElement('label');
    startTimeLabel.textContent = 'Start Time: ';
    pendulumsDiv.appendChild(startTimeLabel);

    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'number';
    startTimeInput.id = 'startTime';
    startTimeInput.value = startTime;
    startTimeInput.step = 0.01;
    startTimeInput.addEventListener('input', () => {
        startTime = parseFloat(startTimeInput.value);
    });
    pendulumsDiv.appendChild(startTimeInput);

    pendulumsDiv.appendChild(document.createElement('br'));

    // Create number of steps input
    const numStepsLabel = document.createElement('label');
    numStepsLabel.textContent = 'Number of Steps: ';
    pendulumsDiv.appendChild(numStepsLabel);

    const numStepsInput = document.createElement('input');
    numStepsInput.type = 'number';
    numStepsInput.id = 'numSteps';
    numStepsInput.value = numSteps;
    numStepsInput.min = 1;
    numStepsInput.addEventListener('input', () => {
        numSteps = parseInt(numStepsInput.value);
    });
    pendulumsDiv.appendChild(numStepsInput);

    pendulumsDiv.appendChild(document.createElement('br'));

    // Create time step input
    const timeStepLabel = document.createElement('label');
    timeStepLabel.textContent = 'Time Step: ';
    pendulumsDiv.appendChild(timeStepLabel);

    const timeStepInput = document.createElement('input');
    timeStepInput.type = 'number';
    timeStepInput.id = 'timeStep';
    timeStepInput.value = timeStep;
    timeStepInput.step = 0.001;
    timeStepInput.min = 0.001;
    timeStepInput.addEventListener('input', () => {
        timeStep = parseFloat(timeStepInput.value);
    });
    pendulumsDiv.appendChild(timeStepInput);

    pendulumsDiv.appendChild(document.createElement('br'));
    pendulumsDiv.appendChild(document.createElement('br'));
}

// Call the function to create global controls
createGlobalControls();

// Add initial pendulum controls
for (let i = 0; i < pendulums.length; i++) {
    addPendulumControl(i);
}

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


