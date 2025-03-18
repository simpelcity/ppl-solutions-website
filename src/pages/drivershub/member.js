document.addEventListener('DOMContentLoaded', async () => {
    const role = document.getElementById('role');
    try {
        const response1 = await fetch('api-members.php');

        if (!response1.ok) {
            throw new Error(`HTTP error! Status: ${response1.status}`);
        }

        const data1 = await response1.json();
        console.log('Truckershub members:', data1);

        const response2 = await fetch('api-members-tmp.php', {
            method: 'POST',
            body: JSON.stringify({
                url: 'https://api.truckersmp.com/v2/vtc/74455/members'
            })
        });

        if (!response2.ok) {
            throw new Error(`HTTP error! Status: ${response2.status}`);
        }

        const data2 = await response2.json();
        console.log('TMP members:', data2);

        const username = document.getElementById('user').textContent;

        const usernameToFind = username;

        const user1 = data1.data.find(member => member.username === usernameToFind);

        if (user1) {
            console.log('Found Truckershub member: ', user1);
        } else {
            console.log(`Truckershub member ${usernameToFind} not found.`);
        }

        const user2 = data2.response.members.find(member => member.steamID === user1.steamID);
        console.log(user2);

        role.textContent = user2.role;
        
        const countryFlag = document.getElementById('country');

        const response3 = await fetch(`https://restcountries.com/v3.1/name/${user1.country}`);

        if (!response3.ok) {
            throw new Error(`HTTP error! Status: ${response3.status}`);
        }

        const data3 = await response3.json();
        
        const countryData = data3.find(country => country.name.common === user1.country);
        console.log(countryData);

        countryFlag.src = countryData.flags.png;
        
    } catch (error) {
        console.error(error);
    }
});