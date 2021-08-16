let canvas = document.getElementById("wave");
var ctx = canvas.getContext("2d");

let real = [0, 1];
let imag = [0, 0];

let o;
let g;

let freq = 220;

let json;

document.getElementById('fileReader').addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                try {
                    json = JSON.parse(e.target.result);
                    applyFileData(json)

                    // alert('json global var has been set to parsed json of this file here it is unevaled = \n' + JSON.stringify(json));
                } catch (ex) {
                    alert('ex when trying to parse json = ' + ex);
                }
            }
        })(f);
        reader.readAsText(f);
    }

}

function applyFileData(json) {
    // console.log(json);
    clearFourier();
    real = json.real;
    while (real[real.length - 1] === 0) {
        real.pop();
    }
    imag = json.imag;

    while (imag[imag.length - 1] === 0) {
        imag.pop();
    }

    while (real.length < imag.length) {
        real.push(0)
    }

    while (imag.length < real.length) {
        imag.push(0)
    }

    console.log(real, imag);

    draw();
}


function saveWave() {
    let saveData = { real, imag };
    let fileName = window.prompt("Enter filename", "custInstrument");
    if (fileName) {
        downloadObjectAsJson(saveData, fileName);
    }
}

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function playNote() {
    console.log(real, imag)
    let context = new (window.AudioContext || window.webkitAudioContext)();
    o = context.createOscillator();
    g = context.createGain();

    let wave = context.createPeriodicWave(new Float32Array(real), new Float32Array(imag), { disableNormalization: false });
    o.setPeriodicWave(wave);
    // o.type = "custom"; // sine, square, sawtooth, triangle
    o.connect(g);
    g.connect(context.destination);
    o.start(0);
    // console.log(freq, firstFreqOff, o.frequency);
    o.frequency.setValueAtTime(freq, context.currentTime);
    o.stop(1);
}

function calculateChange() {
    for (let i=0; i< real.length -1; i++) {
        const realRange = document.getElementById(`real${i}`);
        const realDiv = document.getElementById(`divreal${i}`);
        const imagRange = document.getElementById(`imag${i}`);
        const imagDiv = document.getElementById(`divimag${i}`);
        if (realRange && realDiv && imagRange && imagDiv) {
            real[i + 1] = Number(realRange.value);
            imag[i + 1] = Number(imagRange.value);
            realDiv.innerHTML = realRange.value;
            imagDiv.innerHTML = imagRange.value;
        }
    }
    draw();
}

function clearFourier() {
    real = [0];
    imag = [0];
    const sliderNode = document.getElementById("rangeSliders");
    while (sliderNode.firstChild) {
        sliderNode.removeChild(sliderNode.firstChild);
    }
}

function addFourier(realVal, imagVal) {
    console.log('adding coef')
    const indexToAdd = real.length - 1;
    const sliderSection = document.getElementById("rangeSliders");
    const divSect = document.createElement("div");
    divSect.className = "section";
    const divDoubleDiv = document.createElement("div");
    divDoubleDiv.className = "double";
    const divReal = document.createElement("div");
    divReal.id = `divreal${indexToAdd}`;
    divReal.innerHTML = realVal || 1;
    const divImag = document.createElement("div");
    divImag.id = `divimag${indexToAdd}`;
    divImag.innerHTML = imagVal || 0;

    const divDoubleRange = document.createElement("div");
    divDoubleDiv.className = "double";
    const rangeReal = document.createElement("input");
    rangeReal.onchange = calculateChange;
    rangeReal.id = `real${indexToAdd}`;
    rangeReal.type = "range";
    rangeReal.min = -1;
    rangeReal.max = 1;
    rangeReal.value = realVal || 1;
    rangeReal.step = 0.01;
    const rangeImag = document.createElement("input");
    rangeImag.onchange = calculateChange;
    rangeImag.id = `imag${indexToAdd}`;
    rangeImag.type = "range";
    rangeImag.min = -1;
    rangeImag.max = 1;
    rangeImag.value = imagVal || 0;
    rangeImag.step = 0.01;

    real.push(realVal || 1);
    imag.push(imagVal || 0);

    // < input onchange = "calculateChange()" id = "real0" type = "range" min = "0" max = "1" value = "1" step = "0.01" />
    
    divSect.appendChild(divDoubleDiv);
    divDoubleDiv.appendChild(divReal);
    divDoubleDiv.appendChild(divImag);
    divSect.appendChild(divDoubleRange);
    divDoubleRange.appendChild(rangeReal);
    divDoubleRange.appendChild(rangeImag);
    sliderSection.appendChild(divSect);

    draw();

}

function draw() {
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 3;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCurve(real, imag);
}
draw();

function floatToPxWidth(percent) {
    return floatToPx(percent, canvas.width)
}


function floatToPxHeight(percent) {
    return floatToPx(percent, canvas.height)
}

function floatToPx(percent, maxVal) {
    return percent * maxVal
}

function drawCurve(a, b) {
    ctx.beginPath();
    for (let i=0; i< 100; i++) {
        let t = i/100;
        // ignore j=0 https://webaudio.github.io/web-audio-api/#dom-periodicwaveoptions-real
        let sum = 0;
        for (let k=1; k < a.length; k++) {
            sum += calculatePoint(t, a, b, k)
        }
        const inversNormalisedSum = 1 - ((sum / 3) + 0.5);
        if (i === 0) {
            ctx.moveTo(floatToPxWidth(t), floatToPxHeight(inversNormalisedSum));
        } else {
            ctx.lineTo(floatToPxWidth(t), floatToPxHeight(inversNormalisedSum));
        }
    }
    ctx.stroke();
}

function calculatePoint(t, a, b, k) {
    const twoPIkt = 2 * Math.PI * k * t;
    return (a[k] * Math.cos(twoPIkt)) +  (b[k] * Math.sin(twoPIkt));
}