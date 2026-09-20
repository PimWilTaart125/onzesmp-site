
const SERVER_IP = "play.onzesmp.nl"; 

function copyIP() {
    navigator.clipboard.writeText(SERVER_IP).then(() => {
        const ipBox = document.getElementById("ipBox");
        const originalContent = ipBox.innerHTML;

        ipBox.innerHTML = `
            <span class="ip-text" style="color: #2ecc71;">GEKOPIEERD!</span>
            <span class="copy-btn">Veel plezier in-game!</span>
        `;

        setTimeout(() => {
            ipBox.innerHTML = originalContent;
        }, 2000);
    });
}

async function fetchPlayerCount() {
    const playerCountElement = document.getElementById("playerCount");
    const onlineOrNah = document.getElementById("onlineOrNah");
    const indicator = document.querySelector(".status-indicator");

    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const data = await response.json();

        if (data.online) {
            playerCountElement.textContent = data.players.online;
            indicator.classList.remove("status-offline");
            indicator.classList.add("status-online");
            
            if (data.players.online === 1) {
                onlineOrNah.textContent = "Speler online.";
            } else {
                onlineOrNah.textContent = "Spelers online.";
            }
        } else {
            playerCountElement.textContent = "";
            onlineOrNah.textContent = "Server offline.";
            indicator.classList.remove("status-online");
            indicator.classList.add("status-offline");
        }
    } catch (error) {
        console.error("Fout bij ophalen serverstatus:", error);
        playerCountElement.textContent = "Fout";
        onlineOrNah.textContent = "status onbekend.";
    }
}

fetchPlayerCount();
setInterval(fetchPlayerCount, 60000);
