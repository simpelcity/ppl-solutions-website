document.addEventListener('DOMContentLoaded', async () => {
    const eventsContainer = document.getElementById('events-container');

    try {
        const response = await fetch('fetch_events.php'); // Local proxy endpoint
        const data = await response.json();

        if (!data || !data.response || data.response.length === 0) {
            eventsContainer.innerHTML = '<p>No upcoming events found.</p>';
            return;
        }

        const events = data.response;

        // Function to format date as '30 December 2024'
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options); // '30 December 2024'
        };

        // Function to format time as '18:00'
        const formatTime = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`; // '18:00'
        };

        eventsContainer.innerHTML = events.map(event => {
            return `
                <div class="col-12 col-md-6 col-lg-4 mb-4 h-100">
                    <div class="card h-100 bg-dark p-0 rounded-4">
                        <img src="${event.banner || 'media/default-banner.png'}" class="card-img-top rounded-top-4" alt="${event.name}">
                        <div class="card-body rounded-bottom-4">
                            <h3 class="card-title">${event.name}</h3><br>
                            <p><i class="bi bi-calendar3"></i> <strong>Date:</strong> ${formatDate(event.meetup_at)}</p><br>
                            <p><i class="bi bi-clock"></i> <strong>Meetup Time:</strong> ${formatTime(event.meetup_at)}</p>
                            <p><i class="bi bi-clock"></i> <strong>Departure Time:</strong> ${formatTime(event.start_at)}</p><br>
                            <p><i class="bi bi-truck"></i> <strong>Departure:</strong> ${event.departure ? event.departure.city : 'N/A'} - ${event.departure ? event.departure.location : 'N/A'}</p>
                            <p><i class="bi bi-pin-map"></i> <strong>Destination:</strong> ${event.arrive ? event.arrive.city : 'N/A'} - ${event.arrive ? event.arrive.location : 'N/A'}</p><br>
                            <p><i class="bi bi-controller"></i> <strong>Game:</strong> ${event.game}</p>
                            <p><i class="bi bi-hdd-stack"></i> <strong>Server:</strong> ${event.server?.name || 'Event Server'}</p>
                            <p><i class="bi bi-download"></i> <strong>DLC:</strong> ${event.dlc || 'None'}</p><br>
                            <a class="px-2 py-1" href="https://truckersmp.com/events/${event.id}" target="_blank">Event</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error fetching events:', error);
        eventsContainer.innerHTML = '<p>Error loading events. Please try again later.</p>';
    }
});
