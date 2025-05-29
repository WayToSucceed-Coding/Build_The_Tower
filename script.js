let currentTask = { towers: 4, total: 20 };
let towers = [];
let score = 0;
let level = 1;
let blocksUsed = 0;
let blockColors = ['lego-red', 'lego-blue', 'lego-green', 'lego-yellow', 'lego-orange', 'lego-purple'];
let selectedTower = 0;
let gameCompleted = false;
let blockPaths={
    'lego-red':'images/Lego1.png',
    'lego-orange':'images/Lego2.png',
    'lego-green':'images/Lego3.png',
    'lego-purple':'images/Lego4.png',
    'lego-yellow':'images/Lego5.png',
    'lego-blue':'images/Lego6.png'

}

//Dom Elements
const startBtn = document.querySelector('.start-btn');
const startScreen = document.getElementById('startScreen');
const challengeText = document.getElementById('challengeText');
const equationDisplay = document.getElementById('equationDisplay');

//Event Listeners
startBtn.addEventListener('click',()=>startGame());

//Function to be called when start button is clicked
function startGame() {
    
    const loading = document.getElementById('loading');
    const loadingFill = document.getElementById('loadingFill');

    startBtn.style.display = 'none';
    loading.style.display = 'block';

    // Simulate loading
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                startScreen.classList.add('fade-out');
                setTimeout(() => {
                    initGame();
                }, 800);
            }, 500);
        }
        loadingFill.style.width = progress + '%';
    }, 100);
}


//Function to be called after loading is completed
function initGame() {
    setupTask();
    createTowers();
    updateDisplay();
    //document.getElementById('resultPanel').style.display = 'none';
}

function setupTask() {
    const problems = [
        { towers: 2, total: 10 },
        { towers: 3, total: 12 },
        { towers: 4, total: 16 },
        { towers: 5, total: 15 },
        { towers: 2, total: 14 },
        { towers: 3, total: 18 },
        { towers: 4, total: 20 },
        { towers: 5, total: 25 },
        { towers: 6, total: 18 },
        { towers: 4, total: 24 },
        { towers: 3, total: 21 },
        { towers: 6, total: 30 }
    ];

    let availableProblems = problems.filter(p => {
        if (level <= 3) return p.total <= 20;
        if (level <= 6) return p.total <= 25;
        return true;
    });

    currentTask = availableProblems[Math.floor(Math.random() * availableProblems.length)];
    blocksUsed = 0;
    gameCompleted = false;
    selectedTower = 0;
}

// In the createTowers function, initialize with color property
function createTowers() {
    towers = [];
    for (let i = 0; i < currentTask.towers; i++) {
        towers.push({
            blocks: [],
            color: null
        });
    }
}

function updateDisplay() {
    // Update stats
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('level').textContent = level;
    document.getElementById('blocksLeft').textContent = currentTask.total - blocksUsed;

    // Update challenge
    challengeText.textContent =
        `Goal : Build ${currentTask.towers} equal towers using ${currentTask.total} blocks!`;

    const expectedPerTower = currentTask.total / currentTask.towers;
    equationDisplay.textContent =
        `Hint : ${currentTask.total} ÷ ${currentTask.towers} = ?`;

    // Update progress
    const progress = (blocksUsed / currentTask.total) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.round(progress) + '%';

    // Enable or disable Remove button
    const removeBtn = document.getElementById('removeBtn');

    console.log(towers[selectedTower])
    if (towers[selectedTower].blocks.length > 0) {
        removeBtn.disabled = false;
    } else {
        removeBtn.disabled = true;
    }

    // Update towers display
    const container = document.getElementById('towersContainer');
    container.innerHTML = '';

    for (let i = 0; i < currentTask.towers; i++) {
        const tower = towers[i];
        const towerDiv = document.createElement('div');
        towerDiv.className = 'tower';
        towerDiv.onclick = () => {
            if (!gameCompleted) {
                selectedTower = i;
                updateDisplay();
            }
        };

        if (i === selectedTower && !gameCompleted) {
            towerDiv.classList.add('selected');
        }

        const currentHeight = tower.blocks.length;
        const expectedBlocks = expectedPerTower;

        if (blocksUsed === currentTask.total) {
            if (currentHeight === expectedBlocks) {
                towerDiv.classList.add('correct');
            } else {
                towerDiv.classList.add('incorrect');
            }
        }
        var blockCount=0;
        var blockHeight=0;
        // Add blocks
        tower.blocks.forEach((color, blockIndex) => {
            if(color=='lego-red'){
                blockHeight=17;
            }
            else if(color=='lego-blue' || color=='lego-green'){
                blockHeight=13;
            }
            else if(color=='lego-yellow'){
                blockHeight=18;
            }
            else if(color=='lego-orange'){
                blockHeight=14;
            }
            else if(color=='lego-purple'){
                blockHeight=7.5;
            }

            const blockEl = document.createElement('img');
            blockEl.src = blockPaths[color];
            blockEl.alt = 'LEGO block';
            blockEl.className = `lego-block`;
            blockEl.style.animationDelay = `${blockIndex * 0.1}s`;
            const bottomPosition = 50 + (blockCount * blockHeight);
            blockEl.style.bottom = bottomPosition + 'px';
            blockEl.style.zIndex = blockCount + 1;
            towerDiv.appendChild(blockEl);
            blockCount++;
        });

        // Tower label
        const label = document.createElement('div');
        label.className = 'tower-label';
        const status =
            blocksUsed === currentTask.total
                ? (currentHeight === expectedBlocks ? '✅' : '❌')
                : '⏳';
        label.textContent = `${status} Tower ${i + 1} (${tower.blocks.length})`;

        // Add color indicator
        if (tower.color) {
            const colorIndicator = document.createElement('span');
            colorIndicator.style.display = 'inline-block';
            colorIndicator.style.width = '12px';
            colorIndicator.style.height = '12px';
            colorIndicator.style.borderRadius = '50%';
            colorIndicator.style.marginLeft = '5px';
            colorIndicator.style.backgroundColor = getColorValue(tower.color);
            label.appendChild(colorIndicator);
        }
         towerDiv.appendChild(label);
        container.appendChild(towerDiv);
        
    }
    
}

function getColorValue(colorClass) {
    const colors = {
        'lego-red': '#dc2626',
        'lego-blue': '#2563eb',
        'lego-green': '#16a34a',
        'lego-yellow': '#eab308',
        'lego-orange': '#ea580c',
        'lego-purple': '#9333ea'
    };
    return colors[colorClass] || '#ffffff';
}

// Modified addBlockToTower function
function addBlockToTower(towerId) {
    if (blocksUsed >= currentTask.total || gameCompleted) return;

    let randomColor;
    const tower = towers[towerId];

    if (tower.blocks.length === 0) {
        // Get a random color class that corresponds to an image
        randomColor = blockColors[Math.floor(Math.random() * blockColors.length)];
        tower.color = randomColor;
    } else {
        randomColor = tower.color;
    }

    tower.blocks.push(randomColor);
    blocksUsed++;

    playSound('block');
    updateDisplay();

    if (blocksUsed >= currentTask.total) {
        setTimeout(checkAnswer, 500);
    }
}


function addRandomBlock() {
    if (blocksUsed >= currentTask.total || gameCompleted) return;
    addBlockToTower(selectedTower);
}

// Update the removeBlock function
function removeBlock() {

    if (gameCompleted) return;
    const tower = towers[selectedTower];
    if (tower.blocks.length === 0) return;

    tower.blocks.pop();
    // If tower is now empty, reset its color
    if (tower.blocks.length === 0) {
        tower.color = null;
    }
    blocksUsed--;
    playSound('remove');
    updateDisplay();
}

// Modified checkAnswer()
function checkAnswer() {
    const expected = currentTask.total / currentTask.towers;
    const correct = towers.every(t => t.blocks.length === expected);
    
    if (correct) {
        //showStructureReward();
        createConfetti()
        showResult(true,'Well Done!')
        score += currentTask.total * 2;
        newChallenge()
    } else {
        showResult(false, "Not quite equal yet! Try again.");
    }
}

function showResult(isCorrect, message) {
    // const resultPanel = document.getElementById('resultPanel');
    // resultPanel.className = `result ${isCorrect ? 'correct' : 'incorrect'}`;
    // resultPanel.innerHTML = message;
    // resultPanel.style.display = 'block';
}

function newChallenge() {
    setupTask();
    createTowers();
    updateDisplay();
    // document.getElementById('resultPanel').style.display = 'none';
}

function createConfetti() {
    const colors = [
        '#dc2626',
        '#2563eb',
        '#16a34a',
        '#eab308',
        '#ea580c',
        '#9333ea'
    ];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'block') {
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                400,
                audioContext.currentTime + 0.1
            );
        } else if (type === 'success') {
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        } else if (type === 'error') {
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                100,
                audioContext.currentTime + 0.3
            );
        } else if (type === 'remove') {
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                200,
                audioContext.currentTime + 0.2
            );
        }

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback for browsers that don't support Web Audio API
        // Silent fail
    }
}



