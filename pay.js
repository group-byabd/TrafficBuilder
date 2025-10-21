  document.addEventListener('DOMContentLoaded', () => {
        // --- SCRIPT POUR LE JEU DE CASSE-BRIQUES ---
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const paddle = { x: 0, y: 0, width: 100, height: 15, color: '#00ffff' };
        const ball = { x: 0, y: 0, radius: 7, speed: 4, dx: 4, dy: -4, color: '#ffff00' };
        let bricks = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            resetGame();
        }
        window.addEventListener('resize', resizeCanvas);
        
        window.addEventListener('mousemove', (e) => {
            paddle.x = e.clientX - paddle.width / 2;
        });
        
        function getBrickLayout() {
            bricks = [];
            const formElements = document.querySelectorAll('.payment-container input, .payment-container button');
            if (formElements.length > 0) {
              formElements.forEach(elem => {
                  const rect = elem.getBoundingClientRect();
                  bricks.push({
                      x: rect.left,
                      y: rect.top,
                      width: rect.width,
                      height: rect.height,
                      visible: true,
                      color: '#ff00ff'
                  });
              });
            }
        }

        function resetGame() {
          getBrickLayout();
          if (bricks.length > 0) {
            paddle.y = canvas.height - 40;
            ball.x = canvas.width / 2;
            ball.y = bricks[0].y - 30;
            ball.dx = (Math.random() - 0.5) * 8;
            ball.dy = -4;
          }
        }
        
        function drawPaddle() {
            ctx.fillStyle = paddle.color;
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        }
        
        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.closePath();
        }

        function drawBricks() {
            bricks.forEach(brick => {
                if(brick.visible) {
                    ctx.fillStyle = brick.color;
                    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                }
            });
        }
        
        function moveBall() {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
            if (ball.y - ball.radius < 0) ball.dy *= -1;
            if (ball.y + ball.radius > canvas.height) resetGame();
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.radius > paddle.y) {
                 if(ball.dy > 0) ball.dy *= -1;
            }
            bricks.forEach(brick => {
                if (brick.visible) {
                    if (ball.x > brick.x && ball.x < brick.x + brick.width && ball.y > brick.y && ball.y < brick.y + brick.height) {
                        ball.dy *= -1;
                        brick.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                        setTimeout(() => brick.color = '#ff00ff', 200);
                    }
                }
            });
        }
        
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawPaddle();
            drawBall();
            moveBall();
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        // --- LOGIQUE DU FORMULAIRE DE PAIEMENT ---
        const geminiBtn = document.getElementById('gemini-tip-btn');
        const tipContainer = document.getElementById('tip-container');
        const paymentForm = document.getElementById('payment-form');
        const errorMessageDiv = document.getElementById('error-message');

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const allInputs = document.querySelectorAll('#payment-form input');

        function validateEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        function showErrorMessage(message) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.classList.remove('hidden');
        }

        function hideErrorMessage() {
            errorMessageDiv.classList.add('hidden');
            allInputs.forEach(input => input.classList.remove('invalid'));
        }

        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hideErrorMessage();
            let isValid = true;

            // Validation simple
            if (nameInput.value.trim() === '') {
                nameInput.classList.add('invalid');
                isValid = false;
            }
            if (!validateEmail(emailInput.value)) {
                emailInput.classList.add('invalid');
                isValid = false;
            }
            // Vérifier que les autres champs ne sont pas vides
            document.querySelectorAll('#card, #expiry, #cvv').forEach(input => {
                if (input.value.trim() === '') {
                    input.classList.add('invalid');
                    isValid = false;
                }
            });

            if (isValid) {
                // Rediriger vers la page de remerciement
                window.location.href = 'merci.html';
            } else {
                showErrorMessage('ERREUR: VERIFIEZ LES CHAMPS EN ROUGE !');
            }
        });

        geminiBtn.addEventListener('click', getCheatCode);

        async function getCheatCode() {
            geminiBtn.disabled = true;
            geminiBtn.textContent = 'CHARGEMENT...';
            tipContainer.classList.remove('hidden', 'error');
            tipContainer.textContent = '';

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
            const userQuery = "Agis comme un maître du jeu vidéo des années 80. Donne-moi UN seul faux 'cheat code' amusant pour la réussite financière. Par exemple : HAUT, HAUT, BAS, BAS, GAUCHE, DROITE, GAUCHE, DROITE, B, A, START pour des 'revenus infinis'. Sois créatif et reste dans le thème rétro.";

            const payload = { contents: [{ parts: [{ text: userQuery }] }] };
            
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    tipContainer.textContent = text;
                } else {
                    throw new Error("Réponse de l'API mal formée.");
                }
            } catch (error) {
                console.error("Erreur API Gemini:", error);
                tipContainer.textContent = "Erreur de connexion avec l'arcade...";
                tipContainer.classList.add('error');
            } finally {
                geminiBtn.disabled = false;
                geminiBtn.textContent = 'AUTRE CODE';
            }
        }

        resizeCanvas();
        gameLoop();
    });