// load script after HTML and CSS are loaded
document.addEventListener("DOMContentLoaded", async () => {
  // some global varables
  const container = document.getElementById("container");
  const error = document.getElementById("error");
  let driver = document.getElementById("driver-user").textContent;
  let allPagesData = [];
  let currentPage = 1;
  const loaderNext = document.getElementById("loaderNext");
  let cachedSteamID = null;
  const placeholder = document.getElementById("placeholder");
  const overviewButton = document.getElementById("overview");

  // function to fetch all truckershub drivers and their data
  async function fetchDrivers() {
    const responseApiMembers = await fetch("/api/api-members.php");

    if (!responseApiMembers.ok) {
      throw new Error(`Failed to fetch driver data. Status: ${responseApiMembers.status}`);
    }

    const driversData = await responseApiMembers.json();
    console.log("Drivers data:", driversData);
    const driverData = driversData.data.find((d) => d.username === driver);
    console.log("Driver data:", driverData);

    if (driverData) {
      const steamID = driverData.steamID;
      if (steamID) {
        return steamID;
      }
    } else {
      console.error(`Driver ${driver} not found`);
      error.innerHTML = `Driver not found`;
      throw new Error(`Driver not found: ${driver}`);
    }
  }

  // function to initialize the logged in driver's steamID
  async function initializeSteamID() {
    if (!cachedSteamID) {
      cachedSteamID = await fetchDrivers();
      console.log("Cached SteamID:", cachedSteamID);
    }
  }

  // function to fetch all links from the API
  async function fetchLinks() {
    await initializeSteamID();
    const page = 1;

    const responseLinks = await fetch("/api/api-jobs.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ steamID: cachedSteamID, page }),
    });

    if (!responseLinks.ok) {
      throw new Error(`Failed to fetch links. Status: ${responseLinks.status}`);
    }

    const linksData = await responseLinks.json();
    const links = linksData.links;
    const lastPage = links.last.split("page=")[1];
    console.log("Links data: ", links);
    console.log("Last page:", lastPage);

    // return last page number for pagination
    return lastPage;
  }


  // function to fetch the logged in driver's jobs
  async function fetchJobs(page) {
    try {
      placeholder.style.display = "table-row";

      await initializeSteamID();

      console.log("Fetching jobs for page:", page);
      const response = await fetch("/api/api-jobs.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ steamID: cachedSteamID, page }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched driver API data:`, data);

      let reversedData = [...data.data].reverse();
      console.log("Original Data Array:", data.data);
      console.log("Cloned and Reversed Data Array:", reversedData);

      allPagesData[page - 1] = reversedData;

      placeholder.style.display = "none";
      overviewButton.classList.remove("placeholder");
      renderJobs(reversedData);

      updatePagination(data.links);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      container.innerHTML = `<p class="text-center">Error loading jobs</p>`;
    }
  }

  const lastPage = await fetchLinks();
  currentPage = lastPage;
  fetchJobs(lastPage);

  // function to show the fetched jobs in the "User Jobs" table
  function renderJobs(jobs) {
    if (jobs.length === 0) {
      container.innerHTML = `<p class="text-center">No jobs found</p>`;
      return;
    }

    container.innerHTML = jobs
      .map((job) => {
        const number = `${job.cargo.mass}`;

        // calculate the cargo weight in tons
        thirdNumber = parseFloat(number[2] || 0);
        fourthNumber = parseFloat(number[3] || 0);
        fifthNumber = parseFloat(number[4] || 0);

        if ((thirdNumber = (5 && fourthNumber > 5) || fifthNumber > 5)) {
          calculatedNumber = Math.ceil(number / 1000);
        } else {
          calculatedNumber = Math.floor(number / 1000);
        }

        // convert job timestamp from unix to a readable date
        let unixTimestamp = job.realtime.end;
        let date = new Date(unixTimestamp);
        const options = {
          day: "2-digit",
          year: "numeric",
          month: "2-digit",
        };
        let formattedDate = date.toLocaleDateString("nl-NL", options);

        // show the job data in the table
        return `
                <tr>
                    <td id="e00" class="">${formattedDate}</td>
                    <td id="e01" class="">${job.driver.username}</td>
                    <td id="e02" class="text-uppercase">${job.game.id}</td>
                    <td id="e03" class="">${job.source.city.name} - ${job.destination.city.name}</td>
                    <td id="e04" class="">${job.cargo.name} (${calculatedNumber}t)</td>
                    <td id="e05" class="">${job.truck.name} ${job.truck.model.name}</td>
                    <td id="e06" class="">${job.distanceDriven} km</td>
                    <td id="e07" class="">&euro; ${job.income}</td>
                </tr>
            `;
      })
      .join("");
  }

  // function to update the pagination (page X of total pages)
  function updatePagination(links, isFromCache = false) {
    const currentPageElement = document.getElementById("currentPage");
    const totalPagesElement = document.getElementById("totalPages");

    const lastPage = +links.last.split("page=")[1];
    const reversedPage = lastPage - currentPage + 1;
    currentPageElement.innerHTML = reversedPage;

    if (!isFromCache) {
      totalPagesElement.innerHTML = lastPage;
    }
  }

  // handle previous page button
  const pagination = document.getElementById("pagination");
  const allJobs = document.getElementById("allJobs");
  const previousButton = document.getElementById("previous");
  previousButton.addEventListener("click", async () => {
    if (currentPage >= 1 && currentPage < lastPage) {
      allJobs.classList.add("hidden");
      pagination.style.display = 'flex';
      pagination.style.justifyContent = 'center';
      pagination.style.alignItems = 'center';
      currentPage++;
      if (!allPagesData[currentPage - 1]) {
        await fetchJobs(currentPage);
      } else {
        renderJobs(allPagesData[currentPage - 1]);

        updatePagination(
          {
            first: `?page=1`,
            last: `?page=${allPagesData.length}`,
            next: `?page=${currentPage + 1}`,
            prev: `?page=${currentPage - 1}`,
          },
          true
        );
      }
    }
    previousButton.blur();
  });

  // handle next page button
  const nextButton = document.getElementById("next");
  const nextButtonText = document.getElementById("nextButtonText");
  nextButton.addEventListener("click", async () => {
    if (currentPage <= lastPage && currentPage > 1) {
      nextButtonText.classList.add("hidden");
      loaderNext.style.display = "block";
      allJobs.classList.add("hidden");
      pagination.style.display = 'flex';
      pagination.style.justifyContent = 'center';
      pagination.style.alignItems = 'center';
      try {
        currentPage--;
        if (!allPagesData[currentPage - 1]) {
          await fetchJobs(currentPage);
        } else {
          renderJobs(allPagesData[currentPage - 1]);

          updatePagination(
            {
              first: `?page=1`,
              last: `?page=${allPagesData.length}`,
              next: `?page=${currentPage + 1}`,
              prev: `?page=${currentPage - 1}`,
            },
            true
          );
        }
      } finally {
        loaderNext.style.display = "none";
        nextButtonText.classList.remove("hidden");
      }
    }
    nextButton.blur();
  });

  // handle overview page button
  const overviewButtonText = document.getElementById("overviewButtonText");
  overviewButton.addEventListener("click", async () => {
    overviewButtonText.classList.add("hidden");
    loaderOverview.style.display = "block";
    pagination.style.display = 'none';
    allJobs.classList.remove("hidden");
    allJobs.innerHTML = "Loading all jobs.";
    console.log("Fetching all pages for overview...");
    let page;

    await initializeSteamID();

    const lastPage = await fetchLinks();
    page = lastPage;

    while (page >= 1) {
      try {
        if (!allPagesData[page - 1]) {
          console.log(`Fetching page ${page}...`);

          const response = await fetch("/api/api-jobs.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ steamID: cachedSteamID, page }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(`Failed to fetch page ${page}: ${errorData.message}`);
          }

          const data = await response.json();
          console.log(`Fetched data for page ${page}:`, data);

          if (!data.data || !Array.isArray(data.data)) {
            throw new Error(`Invalid data format on page ${page}`);
          }

          let reversedData = [...data.data].reverse();
          console.log(`Reversed data for page ${page}:`, reversedData);

          allPagesData[page - 1] = reversedData;
        } else {
          console.log(`Page ${page} already cached.`);
        }

        page--;
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log("All pages data:", allPagesData);

    let reversedPagesData = [...allPagesData].slice().reverse();
    console.log("Reversed all pages data:", reversedPagesData);

    container.innerHTML = reversedPagesData
      .flat()
      .map((job) => {
        if (!job || !job.driver) {
          console.error("Invalid job data:", job);
          return `<tr><td colspan="7">Invalid job data</td></tr>`;
        }

        const number = `${job.cargo.mass}`;

        thirdNumber = parseFloat(number[2] || 0);
        fourthNumber = parseFloat(number[3] || 0);
        fifthNumber = parseFloat(number[4] || 0);

        if ((thirdNumber = (5 && fourthNumber > 5) || fifthNumber > 5)) {
          calculatedNumber = Math.ceil(number / 1000);
        } else {
          calculatedNumber = Math.floor(number / 1000);
        }

        let unixTimestamp = job.realtime.end;
        let date = new Date(unixTimestamp);
        const options = {
          day: "2-digit",
          year: "numeric",
          month: "2-digit",
        };
        let formattedDate = date.toLocaleDateString("nl-NL", options);

        return `
                <tr>
                    <td id="e00" class="py-2 px-3">${formattedDate}</td>
                    <td id="e01" class="py-2 px-3">${job.driver.username}</td>
                    <td id="e02" class="py-2 px-3 text-uppercase">${job.game.id}</td>
                    <td id="e03" class="py-2 px-3">${job.source.city.name} - ${job.destination.city.name}</td>
                    <td id="e04" class="py-2 px-3">${job.cargo.name} (${calculatedNumber}t)</td>
                    <td id="e05" class="py-2 px-3 w-206">${job.truck.name} ${job.truck.model.name}</td>
                    <td id="e06" class="py-2 px-3">${job.distanceDriven} km</td>
                    <td id="e07" class="py-2 px-3">&euro; ${job.income}</td>
                </tr>
            `;
      })
      .join("");

    loaderOverview.style.display = "none";
    overviewButtonText.classList.remove("hidden");
    allJobs.innerHTML = "Showing all jobs.";
  });
});
