
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
    
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const data = await response.json();

        if (data.online) {
            playerCountElement.textContent = data.players.online;
        } else {
            playerCountElement.textContent = "0";
        }
    } catch (error) {
        console.error("Fout bij ophalen serverstatus:", error);
        playerCountElement.textContent = "Offline";
    }
}

fetchPlayerCount();

setInterval(fetchPlayerCount, 60000);
