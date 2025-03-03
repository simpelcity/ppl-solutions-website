document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('api-members.php');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.error(error);
    }
});