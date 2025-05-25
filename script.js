let currentTask = { towers: 4, total: 20 };
        let towers = [];
        let score = 0;
        let level = 1;
        let blocksUsed = 0;
        let blockColors = ['lego-red', 'lego-blue', 'lego-green', 'lego-yellow', 'lego-orange', 'lego-purple'];
        let selectedTower = 0;
        let gameCompleted = false;

        // Initialize animated background
        function initBackground() {
            const bgAnimation = document.getElementById('bgAnimation');
            for (let i = 0; i < 15; i++) {
                const block = document.createElement('div');
                block.className = 'bg-block';
                block.style.left = Math.random() * 100 + '%';
                block.style.top = Math.random() * 100 + '%';
                block.style.animationDelay = Math.random() * 6 + 's';
                bgAnimation.appendChild(block);
            }
        }

        function startGame() {
            const startBtn = document.querySelector('.start-btn');
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
                        document.getElementById('startScreen').classList.add('fade-out');
                        setTimeout(() => {
                            document.getElementById('gameContainer').classList.add('active');
                            initGame();
                        }, 800);
                    }, 500);
                }
                loadingFill.style.width = progress + '%';
            }, 100);
        }

        function initGame() {
            setupTask();
            createTowers();
            updateDisplay();
            document.getElementById('resultPanel').style.display = 'none';
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

        function createTowers() {
            towers = [];
            for (let i = 0; i < currentTask.towers; i++) {
                towers.push([]);
            }
        }

        function updateDisplay() {
            // Update stats
            document.getElementById('score').textContent = score;
            document.getElementById('level').textContent = level;
            document.getElementById('blocksLeft').textContent = currentTask.total - blocksUsed;

            // Update challenge
            document.getElementById('challengeText').textContent =
                `🎯 Build ${currentTask.towers} equal towers using ${currentTask.total} blocks!`;

            const expectedPerTower = currentTask.total / currentTask.towers;
            document.getElementById('equationDisplay').textContent =
                `${currentTask.total} ÷ ${currentTask.towers} = ${expectedPerTower}`;

            // Update progress
            const progress = (blocksUsed / currentTask.total) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
            document.getElementById('progressText').textContent = Math.round(progress) + '%';

            // Enable or disable Remove button
            const removeBtn = document.getElementById('removeBtn');
            if (towers[selectedTower].length > 0 && !gameCompleted) {
                removeBtn.disabled = false;
            } else {
                removeBtn.disabled = true;
            }

            // Update towers display
            const container = document.getElementById('towersContainer');
            container.innerHTML = '';

            for (let i = 0; i < currentTask.towers; i++) {
                const towerDiv = document.createElement('div');
                towerDiv.className = 'tower';
                towerDiv.onclick = () => {
                    if (!gameCompleted) {
                        selectedTower = i;
                        updateDisplay();
                    }
                };

                // Visual feedback
                if (i === selectedTower && !gameCompleted) {
                    towerDiv.classList.add('selected');
                }

                const currentHeight = towers[i].length;
                const expectedBlocks = expectedPerTower;

                if (blocksUsed === currentTask.total) {
                    if (currentHeight === expectedBlocks) {
                        towerDiv.classList.add('correct');
                    } else {
                        towerDiv.classList.add('incorrect');
                    }
                }

                // Add blocks
                towers[i].forEach((color, blockIndex) => {
                    const blockEl = document.createElement('div');
                    blockEl.className = `lego-block ${color}`;
                    blockEl.textContent = blockIndex + 1;
                    blockEl.style.animationDelay = `${blockIndex * 0.1}s`;
                    towerDiv.appendChild(blockEl);
                });

                // Tower label
                const label = document.createElement('div');
                label.className = 'tower-label';
                const status =
                    blocksUsed === currentTask.total
                        ? (currentHeight === expectedBlocks ? '✅' : '❌')
                        : '⏳';
                label.textContent = `${status} Tower ${i + 1} (${towers[i].length}/${expectedBlocks})`;

                towerDiv.appendChild(label);
                container.appendChild(towerDiv);
            }

            // Update build button
            const buildBtn = document.getElementById('buildBtn');
            if (blocksUsed >= currentTask.total) {
                buildBtn.disabled = true;
                buildBtn.textContent = '🔨 All Blocks Used';
            } else {
                buildBtn.disabled = false;
                buildBtn.textContent = `🔨 Add to Tower ${selectedTower + 1}`;
            }
        }

        function addBlockToTower(towerId) {
            if (blocksUsed >= currentTask.total || gameCompleted) return;

            const randomColor =
                blockColors[Math.floor(Math.random() * blockColors.length)];
            towers[towerId].push(randomColor);
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

        function removeBlock() {
            if (gameCompleted) return;
            if (towers[selectedTower].length === 0) return;

            towers[selectedTower].pop();
            blocksUsed--;
            playSound('remove');
            updateDisplay();
            document.getElementById('resultPanel').style.display = 'none';
        }

        function checkAnswer() {
            if (blocksUsed < currentTask.total) {
                showResult(
                    false,
                    `🤔 You still have ${currentTask.total - blocksUsed} blocks left to use!`
                );
                return;
            }

            const expectedBlocksPerTower = currentTask.total / currentTask.towers;
            const allTowersEqual = towers.every(
                (tower) => tower.length === expectedBlocksPerTower
            );

            if (allTowersEqual) {
                gameCompleted = true;
                const baseScore = currentTask.total * 2;
                const levelBonus = level * 5;
                const totalScore = baseScore + levelBonus;
                score += totalScore;

                showResult(
                    true,
                    `
                    🎉 PERFECT DIVISION! 🎉<br>
                    <strong>${currentTask.total} ÷ ${currentTask.towers} = ${expectedBlocksPerTower}</strong><br><br>
                    🏆 +${totalScore} points!<br>
                    <small>Next level in 3 seconds...</small>
                `
                );

                createConfetti();
                playSound('success');

                setTimeout(() => {
                    level++;
                    newChallenge();
                }, 3000);
            } else {
                const towerHeights = towers.map((t) => t.length);
                showResult(
                    false,
                    `
                    🤔 Not quite equal yet!<br><br>
                    🎯 Goal: Each tower needs ${expectedBlocksPerTower} blocks<br>
                    📊 Current: ${towerHeights.join(', ')}<br><br>
                    💡 Remember: ${currentTask.total} ÷ ${currentTask.towers} = ${expectedBlocksPerTower}
                `
                );
                playSound('error');
            }
        }

        function showResult(isCorrect, message) {
            const resultPanel = document.getElementById('resultPanel');
            resultPanel.className = `result ${isCorrect ? 'correct' : 'incorrect'}`;
            resultPanel.innerHTML = message;
            resultPanel.style.display = 'block';
        }

        function newChallenge() {
            setupTask();
            createTowers();
            updateDisplay();
            document.getElementById('resultPanel').style.display = 'none';
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

        // Initialize background animation on page load
        document.addEventListener('DOMContentLoaded', () => {
            initBackground();
        });

        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('gameContainer').classList.contains('active'))
                return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (selectedTower > 0) {
                        selectedTower--;
                        updateDisplay();
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (selectedTower < currentTask.towers - 1) {
                        selectedTower++;
                        updateDisplay();
                    }
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    addRandomBlock();
                    break;
                case 'Backspace':
                case 'Delete':
                    e.preventDefault();
                    removeBlock();
                    break;
                case 'c':
                case 'C':
                    e.preventDefault();
                    checkAnswer();
                    break;
                case 'n':
                case 'N':
                    e.preventDefault();
                    newChallenge();
                    break;
            }
        });

        // Add touch support for mobile
        let touchStartY = 0;
        let touchStartX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            if (!document.getElementById('gameContainer').classList.contains('active'))
                return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;

            // Swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0 && selectedTower < currentTask.towers - 1) {
                    // Swipe left - next tower
                    selectedTower++;
                    updateDisplay();
                } else if (deltaX < 0 && selectedTower > 0) {
                    // Swipe right - previous tower
                    selectedTower--;
                    updateDisplay();
                }
            } else if (deltaY > 50) {
                // Swipe up - add block
                addRandomBlock();
            }
        });
