document.addEventListener('DOMContentLoaded', async () => {
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

        
    } catch (error) {
        console.error(error);
    }
});