const SERVER_IP = "play.onzesmp.nl";

function copyIP() {
    const ipBox = document.getElementById("ipBox");

    if (!ipBox) {
        console.error("Element #ipBox does not exist.");
        return;
    }

    const copy = navigator.clipboard?.writeText
        ? navigator.clipboard.writeText(SERVER_IP)
        : Promise.reject(new Error("Clipboard API is unavailable."));

    copy.then(() => {
        const originalContent = ipBox.innerHTML;

        ipBox.innerHTML = `
            <span class="ip-text copied">GEKOPIEERD!</span>
            <span class="copy-btn">Veel plezier in-game!</span>
        `;

        setTimeout(() => {
            ipBox.innerHTML = originalContent;
        }, 2000);
    }).catch((error) => {
        console.error("Kopiëren mislukt:", error);
        alert(`Kopiëren mislukt. Kopieer het IP handmatig: ${SERVER_IP}`);
    });
}

async function fetchPlayerCount() {
    const playerCountElement = document.getElementById("playerCount");
    const onlineOrNah = document.getElementById("onlineOrNah");
    const indicator = document.querySelector(".status-indicator");

    if (!playerCountElement || !onlineOrNah || !indicator) {
        console.error("Een of meerdere serverstatus-elementen ontbreken.");
        return;
    }

    try {
        const response = await fetch(
            `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`,
            { headers: { Accept: "application/json" } }
        );

        if (!response.ok) {
            throw new Error(`API-fout: ${response.status}`);
        }

        const data = await response.json();
        const isOnline = data.online === true;

        if (isOnline) {
            const onlinePlayers = Number(data.players?.online ?? 0);

            playerCountElement.textContent = onlinePlayers;
            onlineOrNah.textContent = onlinePlayers === 1
                ? "Speler online."
                : "Spelers online.";
            indicator.classList.remove("status-offline");
            indicator.classList.add("status-online");
        } else {
            playerCountElement.textContent = "";
            onlineOrNah.textContent = "Server offline.";
            indicator.classList.remove("status-online");
            indicator.classList.add("status-offline");
        }
    } catch (error) {
        console.error("Fout bij ophalen serverstatus:", error);
        playerCountElement.textContent = "—";
        onlineOrNah.textContent = "Status onbekend.";
        indicator.classList.remove("status-online");
        indicator.classList.add("status-offline");
    }
}

function initialiseServerStatus() {
    fetchPlayerCount();
    setInterval(fetchPlayerCount, 5000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseServerStatus);
} else {
    initialiseServerStatus();
}
