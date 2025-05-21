document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('container');
    let driver = document.getElementById('driver-user').textContent;
    let allPagesData = [];
    let currentPage = 1;

    async function fetchDrivers() {
        const responseApiMembers = await fetch('api-members.php');

        if (!responseApiMembers.ok) {
            throw new Error(`Failed to fetch driver data. Status: ${responseApiMembers.status}`);
        }

        const driversData = await responseApiMembers.json();
        const driverData = driversData.data.find(d => d.username === driver);
        const steamID = driverData.steamID;

        console.log('Drivers data: ', driversData);
        console.log('Driver Data: ', driverData);
        console.log('Driver steamID:', steamID);

        return steamID;
    }

    async function fetchJobs(page) {
        try {
            const steamID = await fetchDrivers();

            console.log('Fetching jobs for page:', page);
            const response = await fetch('api-jobs.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ steamID, page }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Fetched driver API data:`, data);

            allPagesData[page - 1] = data.data;

            renderJobs(data.data);

            updatePagination(data.links);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            container.innerHTML = `<p class="text-center">Error loading jobs</p>`;
        }
    }

    function renderJobs(jobs) {
        if (jobs.length === 0) {
            container.innerHTML = `<p class="text-center">No jobs found</p>`;
            return;
        }

        container.innerHTML = jobs.map(job => {
            const number = `${job.cargo.mass}`;
                
            thirdNumber = parseFloat(number[2] || 0);
            fourthNumber = parseFloat(number[3] || 0);
            fifthNumber = parseFloat(number[4] || 0);

            if (thirdNumber = 5 && fourthNumber > 5 || fifthNumber > 5) {
                calculatedNumber = Math.ceil(number / 1000);
            } else {
                calculatedNumber = Math.floor(number / 1000);
            }

            return`
                <tr>
                    <td class="py-2 px-3">${job.driver.username}</td>
                    <td class="py-2 px-3 text-uppercase">${job.game.id}</td>
                    <td class="py-2 px-3">${job.source.city.name} - ${job.destination.city.name}</td>
                    <td class="py-2 px-3">${job.cargo.name} (${calculatedNumber}t)</td>
                    <td class="py-2 px-3">${job.truck.name} ${job.truck.model.name}</td>
                    <td class="py-2 px-3">${job.distanceDriven} km</td>
                    <td class="py-2 px-3">&euro; ${job.income}</td>
                </tr>
            `;
        }).join('');
    }

    function updatePagination(links, isFromCache = false) {
        const currentPageElement = document.getElementById('currentPages');
        const totalPagesElement = document.getElementById('totalPages');

        const nextPage = links.next ? +links.next.split('page=')[1] : null;
        const currentPage = nextPage ? nextPage - 1 : +links.last.split('page=')[1];
        currentPageElement.innerHTML = currentPage;

        if (!isFromCache) {
            const lastPage = +links.last.split('page=')[1];
            totalPagesElement.innerHTML = lastPage;
        }
    }

    fetchJobs(currentPage);

    const previousButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');

    previousButton.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            if (!allPagesData[currentPage - 1]) {
                await fetchJobs(currentPage);
            } else {
                renderJobs(allPagesData[currentPage - 1]);

                updatePagination({
                    first: `?page=1`,
                    last: `?page=${allPagesData.length}`,
                    next: `?page=${currentPage + 1}`,
                    prev: `?page=${currentPage - 1}`,
                }, true);
            }
        }
    });

    nextButton.addEventListener('click', async () => {
        currentPage++;
        if (!allPagesData[currentPage - 1]) {
            await fetchJobs(currentPage);
        } else {
            renderJobs(allPagesData[currentPage - 1]);

            updatePagination({
                first: `?page=1`,
                last: `?page=${allPagesData.length}`,
                next: `?page=${currentPage + 1}`,
                prev: `?page=${currentPage - 1}`,
            }, true);
        }
    });

    const overviewButton = document.getElementById('overview');
    overviewButton.addEventListener('click', async () => {
        console.log('Fetching all pages...');
        allPagesData = [];

        let page = 1;
        let hasMorePages = true;

        const steamID = await fetchDrivers();

        while (hasMorePages) {
            try {
                console.log(`Fetching page ${page}...`);
                const response = await fetch('api-jobs.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ steamID, page }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API Error:', errorData);
                    throw new Error(`Failed to fetch page ${page}: ${errorData.message}`);
                }

                const data = await response.json();
                console.log(`Fetched data for page ${page}:`, data);

                if (!data.data || !Array.isArray(data.data)) {
                    throw new Error(`Invalid data format on page ${page}`);
                }

                allPagesData[page - 1] = data.data;

                if (data.links && data.links.next) {
                    page++;
                } else {
                    hasMorePages = false;
                }
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
                hasMorePages = false;
            }
        }

        console.log('All Pages Data:', allPagesData);

        container.innerHTML = allPagesData.flat().map(job => {
            if (!job || !job.driver) {
                console.error('Invalid job data:', job);
                return `<tr><td colspan="7">Invalid job data</td></tr>`;
            }
            
            return`
                <tr>
                    <td class="py-2 px-3">${job.driver.username}</td>
                    <td class="py-2 px-3 text-uppercase">${job.game.id}</td>
                    <td class="py-2 px-3">${job.source.city.name} - ${job.destination.city.name}</td>
                    <td class="py-2 px-3">${job.cargo.name} (${Math.floor(job.cargo.mass / 1000)}t)</td>
                    <td class="py-2 px-3 w-206">${job.truck.name} ${job.truck.model.name}</td>
                    <td class="py-2 px-3">${job.distanceDriven} km</td>
                    <td class="py-2 px-3">&euro; ${job.income}</td>
                </tr>
            `;
        }).join('');
    });
});