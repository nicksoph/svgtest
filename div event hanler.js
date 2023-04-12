// <div id="sliderContainer">
//     <!-- Sliders and radio buttons will be added here -->
// </div>
// <button id="addPendulum">Add Pendulum</button>

// <script>

const pendulumsDiv = document.getElementById('pendulumsDiv');
const addPendulumBtn = document.getElementById('addPendulum');



// Event listener for the container element
pendulumsDiv.addEventListener('input', function (event) {
    const target = event.target;
    const index = parseInt(target.getAttribute('data-index'), 10);
    const property = target.getAttribute('data-property');

    if (target.tagName === 'INPUT' && target.type === 'range') {
        // Update the corresponding property in the Pendulums array
        Pendulums[index][property] = parseFloat(target.value);
    } else if (target.tagName === 'INPUT' && target.type === 'radio') {
        // Update the 'axis' property
        Pendulums[index][property] = target.value;
    }

    console.log(`Pendulum ${index} updated: `, Pendulums[index]);
});

// Function to add a new slider
function addSlider(index, property, min, max, step) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = Pendulums[index][property];
    slider.setAttribute('data-index', index);
    slider.setAttribute('data-property', property);
    pendulumsDiv.appendChild(slider);
    pendulumsDiv.appendChild(document.createElement('br'));
}

// Function to add axis radio buttons
function addAxisRadioButtons(index) {
    const xRadio = document.createElement('input');
    xRadio.type = 'radio';
    xRadio.name = `axis-${index}`;
    xRadio.value = 'x';
    xRadio.setAttribute('data-index', index);
    xRadio.setAttribute('data-property', 'axis');
    if (Pendulums[index].axis === 'x') {
        xRadio.checked = true;
    }

    const yRadio = document.createElement('input');
    yRadio.type = 'radio';
    yRadio.name = `axis-${index}`;
    yRadio.value = 'y';
    yRadio.setAttribute('data-index', index);
    yRadio.setAttribute('data-property', 'axis');
    if (Pendulums[index].axis === 'y') {
        yRadio.checked = true;
    }

    pendulumsDiv.appendChild(document.createTextNode('Axis: X '));
    pendulumsDiv.appendChild(xRadio);
    pendulumsDiv.appendChild(document.createTextNode(' Y '));
    pendulumsDiv.appendChild(yRadio);
    pendulumsDiv.appendChild(document.createElement('br'));
}

// Function to add a new pendulum
function addPendulum() {
    const pendulum = {
        axis: 'x',
        amplitude: 0,
        frequency: 0,
        phaseShift: 0,
        damping: 0,
    };
    Pendulums.push(pendulum);
    const index = Pendulums.length -
