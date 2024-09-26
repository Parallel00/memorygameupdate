document.addEventListener("DOMContentLoaded", function () {
    const mainGame = document.getElementById("maingame");
    let stopwatch = document.getElementById("stopwatch");
    const winnerTag = document.getElementById("winTag");
    let time = 0
    let tile1 = null;
    let tile2 = null;
    let numOfTilesFlipped = 0;
    let currentScore = 0;
    let start = document.getElementById("start");
    const startButton = document.querySelectorAll(".startButton");
    let stopClicking = false;
    let prevTime = localStorage.getItem("previous-best-time");
    const container = document.getElementById("aboveContainer");

    const COLORS = [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "orange",
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "orange",
    ];

    function countSeconds() {
        time += 1;
        stopwatch.innerText = "Time: " + time;
    }

    function divCreate(colorArray) {
        for (let color of colorArray) {
            const newDiv = document.createElement("div");
            newDiv.classList.add(color);
            newDiv.addEventListener("click", clickInst);
            mainGame.append(newDiv);
        }
    }

    var keepTime = null;

    startButton.forEach(function (button) {
        button.addEventListener("click", function () {
            let shuffledColors = shuffleTiles(COLORS); // Shuffle colors before game starts
            divCreate(shuffledColors); // Use shuffled colors array
            keepTime = setInterval(function () {
                countSeconds();
            }, 1000);
            button.remove();
        });
    });

    function clickInst(e) {
        if (stopClicking) return;
        if (e.target.classList.contains("flipped")) return;

        let currentTile = e.target;
        currentTile.style.backgroundColor = currentTile.classList[0];

        if (!tile1 || !tile2) {
            currentTile.classList.add("flipped");
            tile1 = tile1 || currentTile;
            tile2 = currentTile === tile1 ? null : currentTile;
        }

        if (tile1 && tile2) {
            stopClicking = true;
            let color1 = tile1.className;
            let color2 = tile2.className;

            if (color1 === color2) {
                numOfTilesFlipped += 2;
                tile1.removeEventListener("click", clickInst);
                tile2.removeEventListener("click", clickInst);
                tile1 = null;
                tile2 = null;
                stopClicking = false;
            } else {
                setTimeout(function () {
                    tile1.style.backgroundColor = "";
                    tile2.style.backgroundColor = "";
                    tile1.classList.remove("flipped");
                    tile2.classList.remove("flipped");
                    tile1 = null;
                    tile2 = null;
                    stopClicking = false;
                }, 1000);
            }
        }

        if (numOfTilesFlipped === COLORS.length) {
            clearInterval(keepTime);
            let winTag = document.createElement("h1");
            winnerTag.append(winTag);
            let prevTime = +localStorage.getItem("previous-best-time") || Infinity;
            if (time < prevTime) {
                winnerTag.innerText += "You win! NEW BEST TIME! - " + time + " SECONDS!";
                localStorage.setItem("previous-best-time", time);
                const resBut = document.createElement("button");
                resBut.innerText = "Reset Game";
                resBut.addEventListener("click", function (e) {
                    mainGame.innerHTML = "";
                    let shuffledColors = shuffleTiles(COLORS); // Shuffle colors on reset
                    divCreate(shuffledColors); // Use shuffled colors for reset game
                    time = 0;
                    numOfTilesFlipped = 0;
                    stopwatch.innerText = "Time: " + time;

                    startButton.forEach(function (button) {
                        button.style.display = "block";
                    });
                    keepTime = setInterval(function () {
                        countSeconds();
                    }, 1000);
                    winnerTag.innerHTML = "";
                    container.appendChild(stopwatch);
                    resBut.remove();
                });
                container.appendChild(resBut);
            } else {
                winnerTag.innerText += "You win!";
                const resBut = document.createElement("button");
                resBut.innerText = "Play Again!";
                resBut.addEventListener("click", function (e) {
                    mainGame.innerHTML = "";
                    let shuffledColors = shuffleTiles(COLORS); // Shuffle colors on "Play Again"
                    divCreate(shuffledColors); // Use shuffled colors for new game
                    time = 0;
                    numOfTilesFlipped = 0;
                    stopwatch.innerText = "Time: " + time;

                    startButton.forEach(function (button) {
                        button.style.display = "block";
                    });
                    keepTime = setInterval(function () {
                        countSeconds();
                    }, 1000);
                    winnerTag.innerHTML = "";
                    container.appendChild(stopwatch);
                    resBut.remove();
                });
                container.appendChild(resBut);
            }
        }
    }

    function shuffleTiles(array) {
        let count = array.length;
        while (count > 0) {
            let index = Math.floor(Math.random() * count);
            count--;
            let temp = array[count];
            array[count] = array[index];
            array[index] = temp;
        }
        return array;
    }
});
