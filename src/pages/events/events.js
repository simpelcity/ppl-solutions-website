document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('events-container');

    try {
        const response = await fetch('../../api/api-events.php', {
            method: 'POST',
            body: JSON.stringify({
                url: 'https://api.truckersmp.com/v2/vtc/74455/events/attending'
            })
        });

        console.log(response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            container.innerHTML = `<p class="text-center">No data found.</p>`;
            return;
        }

        const events = data.response;

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options);
        };

        const formatTime = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };

        container.innerHTML = events.map(event => {
            return `
            <div class="col-12 col-md-6 col-lg-4 my-2">
                <div class="card bg-dark p-0 rounded-4 text-light border border-primary border-3 h-100">
                    <img src="${event.banner || 'media/default-banner.png'}" class="card-img-top rounded-top-4 object-fit-cover" alt="${event.name}">
                    <div class="card-body rounded-bottom-4 d-flex flex-column">
                        <h3 class="card-title">${event.name}</h3><br>
                        <p class="m-0"><i class="bi bi-calendar3"></i> <strong>Date:</strong> ${formatDate(event.meetup_at)}</p><br>
                        <p class="m-0"><i class="bi bi-clock"></i> <strong>Meetup Time:</strong> ${formatTime(event.meetup_at)}</p>
                        <p class="m-0"><i class="bi bi-clock"></i> <strong>Departure Time:</strong> ${formatTime(event.start_at)}</p><br>
                        <p class="m-0"><i class="bi bi-truck"></i> <strong>Departure:</strong> ${event.departure ? event.departure.city : 'N/A'} - ${event.departure ? event.departure.location : 'N/A'}</p>
                        <p class="m-0"><i class="bi bi-pin-map"></i> <strong>Destination:</strong> ${event.arrive ? event.arrive.city : 'N/A'} - ${event.arrive ? event.arrive.location : 'N/A'}</p><br>
                        <p class="m-0"><i class="bi bi-controller"></i> <strong>Game:</strong> ${event.game}</p>
                        <p class="m-0"><i class="bi bi-hdd-stack"></i> <strong>Server:</strong> ${event.server?.name || 'Event Server'}</p>
                        <p class="m-0"><i class="bi bi-download"></i> <strong>DLC:</strong> ${event.dlc || 'None'}</p><br>
                        <a class="btn text-light border text-decoration-none mt-auto w-fit-content" href="https://truckersmp.com${event.url}" target="_blank">Event</a>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    } catch (error) {
        console.log(error);
        container.innerHTML = `<p class="text-danger text-center">Failed to load data</p>`;
    }
});