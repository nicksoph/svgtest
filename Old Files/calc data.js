//calc data


// Function to update the SVG based on the current pendulum settings
function updateSVG() {
    // Clear the current SVG
    svgContainer.innerHTML = '';
    // Recalculate the sine wave data based on the current pendulum settings
    Points.length = 0;
    for (let i = 0; i < numSteps; i++) {
        let x = startTime + i * timeStep;
        let y = 0;
        pendulums.forEach((pendulum) => {
            if (pendulum.axis === 'y') {
                y += pendulum.amplitude * Math.sin(pendulum.frequency * x + pendulum.phaseShift) * pendulum.damping ** x;
            }
        });
        Points.push({ p1: { x: x * multi, y: y * multi } });
    }

    // Re-run the main function to update the SVG

}
main();