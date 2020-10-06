// Constants
var keys = ['zsxdcvgbhnjm,l.;/', 'q2w3er5t6y7ui9o0p[+]_\\']
var notes = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B'.split(',')

var presetSounds = [
  {
    name: 'Grand Piano',
    fileName: '/revenant2/resources/samples/grandPiano.wav'
  },
  {
    name: 'Nintendo DS Piano',
    fileName: '/revenant2/resources/samples/nintendoDsPiano.mp3',
    rootPitch: 69
  },
  {
    name: 'Electric Piano',
    fileName: '/revenant2/resources/samples/electricPiano.wav'
  },
  {
    name: 'Brass 1',
    fileName: '/revenant2/resources/samples/brass1.wav',
    rootPitch: 65
  },
  {
    name: 'Brass 2',
    fileName: '/revenant2/resources/samples/brass2.wav',
    rootPitch: 79
  },
  {
    name: 'Horns',
    fileName: '/revenant2/resources/samples/horns.wav',
    rootPitch: 65
  },
  {
    name: 'Saxophone 1',
    fileName: '/revenant2/resources/samples/saxophone1.wav'
  },
  {
    name: 'Saxophone 2',
    fileName: '/revenant2/resources/samples/saxophone2.wav',
    rootPitch: 76
  },
  {
    name: 'Trumpet',
    fileName: '/revenant2/resources/samples/trumpet.wav',
    rootPitch: 65
  },
  {
    name: 'Electric Guitar',
    fileName: '/revenant2/resources/samples/electricGuitar.wav',
    rootPitch: 79
  },
  {
    name: 'Xylophone',
    fileName: '/revenant2/resources/samples/xylophone.wav',
    rootPitch: 72
  },
  {
    name: 'Synth Lead 1',
    fileName: '/revenant2/resources/samples/synthLead1.mp3',
    rootPitch: 69
  },
  {
    name: 'Synth Lead 2',
    fileName: '/revenant2/resources/samples/synthLead2.mp3',
    rootPitch: 75
  },
  {
    name: 'Synth Lead 3',
    fileName: '/revenant2/resources/samples/synthLead3.wav',
    rootPitch: 67
  },
  {
    name: 'Synth Pad',
    fileName: '/revenant2/resources/samples/synthPad.mp3',
    rootPitch: 69
  },
  {
    name: '8-Bit Synth',
    fileName: ''
  },
  {
    name: 'Oof!',
    fileName: '/revenant2/resources/samples/oof.wav',
    rootPitch: 72
  }
]

var userSamples = []

// Variables
var octave = 4
var pressedKeys = []
var selectedSound = 0

// Views
var fileChooserView = document.getElementById('fileChooser')
var currentOctaveView = document.getElementById('currentOctave')
var activeVoicesView = document.getElementById('activeVoices')
var sampleDropAreaView = document.getElementById('sampleDropArea')
var mySamplesView = document.getElementById('mySamples')
var presetSoundsView = document.getElementById('presetSounds')
var selectedSoundView = null
var addUserSampleView = document.getElementById('addUserSample')

// Functions
function determineKeyPressed(e) {
  for (var keyRow = 0; keyRow < keys.length; keyRow++) {
    keyPressed = keys[keyRow].indexOf(e)

    if (keyPressed != -1) {
      return {
        note: notes[keyPressed % notes.length],
        octave: octave + keyRow + Math.floor(keyPressed / notes.length)
      }
    }
  }

  return null
}

function getSound(index) {
  if (index >= presetSounds.length) {
    return userSamples[index - presetSounds.length]
  }

  return presetSounds[index]
}

function loadSample(file) {
  var fileReader = new FileReader()

  fileReader.addEventListener('load', function () {
    var name = file.name
    name = name.substring(0, name.length - 4)

    userSamples.push({
      name: name,
      fileName: fileReader.result,
      custom: true
    })

    polySynth = polySynthWithSample(presetSounds.length + userSamples.length - 1)
    selectedSound = presetSounds.length + userSamples.length - 1
    selectedSoundView.className = ''
    updateMySamplesView()
  })

  if (file) {
    if (true) {
      fileReader.readAsDataURL(file)
    } else {
      alert('The sample cannot be read')
    }
  }
}

function polySynthWithSample(index) {
  if (getSound(index).name === '8-Bit Synth') {
    var polySynth = new Tone.PolySynth(8, Tone.Synth).connect(volume);
    polySynth.set('envelope.decay', 0.2);
    polySynth.set('envelope.sustain', 0.3);
    polySynth.set('envelope.release', 0.01);
    polySynth.set('oscillator', { type: 'pulse' });
    polySynth.set('volume', -6);
    return polySynth
  }

  var polySynth = new Tone.Sampler().connect(volume)
  var sample = getSound(index)
  var rootPitch = 60

  if (sample.rootPitch != undefined) {
    rootPitch = sample.rootPitch
  }

  polySynth.add(rootPitch, sample.fileName, null)
  polySynth.release = 0.1
  return polySynth
}

function updateCurrentOctaveView() {
  currentOctaveView.innerText = octave
}

function updateActiveVoicesView() {
  activeVoicesView.innerHTML = pressedKeys.join('<span style="color: rgba(255, 255, 255, 0.5);">, </span>')
}

function updateMySamplesView() {
  mySamplesView.style = 'display: flex;'

  while (mySamplesView.firstChild) {
    mySamplesView.removeChild(mySamplesView.firstChild);
  }

  for (var i = 0; i < userSamples.length; i++) {
    var buttonView = document.createElement('button')
    var index = i + presetSounds.length

    if (index === selectedSound) {
      buttonView.className = 'selected'
      selectedSoundView = buttonView
    }

    buttonView.dataset['index'] = index
    buttonView.innerText = getSound(index).name
    
    buttonView.onclick = function(e) {
      soundViewOnClick(e)
    }

    mySamplesView.appendChild(buttonView)
  }
}

function updatePresetSoundsView() {
  while (presetSoundsView.firstChild) {
    presetSoundsView.removeChild(presetSoundsView.firstChild);
  }

  for (var i = 0; i < presetSounds.length; i++) {
    var buttonView = document.createElement('button')

    if (i === selectedSound) {
      buttonView.className = 'selected'
      selectedSoundView = buttonView
    }

    buttonView.dataset['index'] = i
    buttonView.innerText = getSound(i).name

    buttonView.onclick = function(e) {
      soundViewOnClick(e)
    }

    presetSoundsView.appendChild(buttonView)
  }
}

function soundViewOnClick(e) {
  if (pressedKeys.length != 0) {
    return
  }

  var index = e.target.dataset['index']

  if (index === selectedSound) {
    return
  }

  polySynth = polySynthWithSample(index)
  selectedSample = index

  if (selectedSoundView != null) {
    selectedSoundView.className = ''
  }

  selectedSoundView = e.target
  selectedSoundView.className = 'selected'
}

// Events
document.ondragover = function(e) {
  e.preventDefault()
}

document.ondrop = function(e) {
  e.preventDefault()
}

document.onkeydown = function(e) {
  if (!e.getModifierState('Control') && !e.getModifierState('Meta')) {
    if ((e.key == '-' && octave > 1) || (e.key == '=' && octave < 9)) {
      if (e.key == '-') {
        octave--
      }

      if (e.key == '=') {
        octave++
      }

      for (var i = 0; i < 15; i++) {
        polySynth.triggerRelease(pressedKeys.pop())
      }

      updateCurrentOctaveView()
      updateActiveVoicesView()
    }

    var keyPressed = determineKeyPressed(e.key)

    if (keyPressed != null) {
      noteName = keyPressed.note + keyPressed.octave

      if (!pressedKeys.includes(noteName)) {
        try {
          polySynth.triggerAttack(noteName)
        } catch { }

        pressedKeys.push(noteName)
        updateActiveVoicesView()
      }
    }
  }
}

document.onkeyup = function(e) {
  var keyPressed = determineKeyPressed(e.key)

  if (keyPressed != null) {
    noteName = keyPressed.note + keyPressed.octave

    if (pressedKeys.includes(noteName)) {
      polySynth.triggerRelease(noteName)
      pressedKeys.splice(pressedKeys.indexOf(noteName), 1)
      updateActiveVoicesView()
    }
  }
}

fileChooserView.onchange = function() {
  var file = fileChooserView.files[0]
  loadSample(file)
}

addUserSampleView.onclick = function() {
  setTimeout(function () {
    fileChooserView.value = ''
    fileChooserView.click()
  }, 200)
}

sampleDropAreaView.ondragover = function(e) {
  sampleDropAreaView.className = 'active'
  e.preventDefault()
}

sampleDropAreaView.ondragend = function(e) {
  sampleDropAreaView.className = ''
}

sampleDropAreaView.ondragexit = function(e) {
  sampleDropAreaView.className = ''
}

sampleDropAreaView.ondragleave = function(e) {
  sampleDropAreaView.className = ''
}

sampleDropAreaView.ondrop = function(e) {
  e.preventDefault()
  sampleDropAreaView.className = ''
  var file = e.dataTransfer.files[0]
  loadSample(file)

  e.dataTransfer.clearData()
}

var volume = new Tone.Volume(-8).toMaster()
var polySynth = polySynthWithSample(0)
updateCurrentOctaveView()
updatePresetSoundsView()