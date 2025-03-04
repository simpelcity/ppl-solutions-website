document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('container');
    
    let driver = document.getElementById('driver-user').textContent;
    
    let steamID = "";
    if (driver === "Wietsegaming") {
        steamID = "76561199224465097";
    } else if (driver === "malekleco") {
        steamID = "76561199523692352";
    } else if (driver === "47Brambora") {
        steamID = "76561198333686856";
    } else if (driver === "Lukyy09") {
        steamID = "76561199571002029";
    }

    let currentPage = 1;

    async function fetchJobs(page) {
        console.log(`Fetching data for page: ${page}`);
        try {
            const responseApi3 = await fetch('api-jobs.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ steamID, page }),
            });

            if (!responseApi3.ok) {
                throw new Error(`HTTP error! Status: ${responseApi3.status}`);
            }

            const data = await responseApi3.json();
            console.log(`Fetched driver API data:`, data);
            console.log(`Driver steamID: "${steamID}"`);

            const jobs = data.data || [];

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
                
                return `
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


            function currentPage() {
                let firstPageLink = data.links.first;
                let lastPageLink = data.links.last;
                let nextPageLink = data.links.next;
                let prevPageLink = data.links.prev;

                let lastDigitFirst = +firstPageLink.split("page=")[1];
                let lastDigitLast = +lastPageLink.split("page=")[1];
                let currentpage;

                if (prevPageLink === null) {
                    currentpage = lastDigitFirst;
                } else if (nextPageLink === null) {
                    currentpage = lastDigitLast;
                } else {
                    let nextPageNumber = +nextPageLink.split("page=")[1];
                    currentpage = nextPageNumber - 1;
                }

                console.log('Current page:', currentpage);
                document.getElementById('currentPages').innerHTML = currentpage;
            }

            function totalPages() {
                let totalpages = `${data.links.last}`;
                console.log(`total pages link: ${totalpages}`);

                let toString = totalpages.toString();
                let lastNum = toString.slice(-1);
                let lastDigit = +(lastNum);
                console.log(lastDigit);

                const totalPagesElement = document.getElementById('totalPages');
                totalPagesElement.innerHTML = lastDigit;
            }

            currentPage();
            totalPages();

        } catch (error) {
            console.error(error);
            container.innerHTML = `<p class="text-center">Error loading jobs</p>`;
        }
    }

    fetchJobs(currentPage);

    const previousButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');

    previousButton.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await fetchJobs(currentPage);
        }
    });

    nextButton.addEventListener('click', async () => {
        currentPage++;
        await fetchJobs(currentPage);
    });

    
    document.getElementById('previous').addEventListener('click', toggleLoading);
    document.getElementById('next').addEventListener('click', toggleLoading);

    function toggleLoading(event) {
        const button = event.currentTarget;
        const buttonText = button.querySelector('#buttonText');
        const spinner = button.querySelector('#dotSpinner');

        buttonText.classList.add('hidden');
        spinner.classList.remove('hidden');

        setTimeout(() => {
            spinner.classList.add('hidden');
            buttonText.classList.remove('hidden');
        }, 1300);
    }

});
