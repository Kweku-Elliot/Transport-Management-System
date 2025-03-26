async function fetchVehicles() {
    try {
        const res = await fetch("http://localhost:5000/admin/vehicles");

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const vehicles = await res.json();
        console.log("Fetched Vehicles:", vehicles);  // Debugging Line
       

        let vehicleSelect = document.getElementById("vehicleSelect");

        vehicleSelect.innerHTML = "";

        vehicles.forEach(vehicle => {
            console.log("Vehicle Data:", vehicle);  // Debugging Line
            
            vehicleSelect.innerHTML += `
                <option value="${vehicle.id}">
                    ${vehicle.vehicle_no} (Driver: ${vehicle.driver_name})
                </option>`;
        });

    } catch (error) {
        console.error(" Error fetching vehicles:", error);
    }
}

async function bookTransport(event) {  
    event.preventDefault(); // Prevent page reload on form submission

    

    const rawUser = sessionStorage.getItem("user");
    if (!rawUser) {
        console.error(" No user data found in session storage.");
        return;
    }

    let user;
    try {
        user = JSON.parse(rawUser);
        console.log(" Parsed User Object:", user);
    } catch (error) {
        console.error(" JSON Parsing Error:", error);
        return;
    }

    //  Define userId before using it
    const userId = user.id;  
    console.log(" Extracted userId:", userId);

    // Extract form values
    const pickup_location = document.getElementById("pickup").value.trim();
    const dropoff_location = document.getElementById("dropoff").value.trim();
    const date = document.getElementById("date").value;

    const timeSlotId = Number(document.getElementById("time_slot")?.value);
if (!timeSlotId) {
    console.error(" No time slot selected!");
    alert(" Please select a time slot.");
    return;
}



    const vehicleSelect = document.getElementById("vehicleSelect");
    if (vehicleSelect.selectedIndex < 0) {
        console.error(" No vehicle selected!");
        alert(" Please select a vehicle.");
        return;
    }
    const vehicleId = Number(vehicleSelect.options[vehicleSelect.selectedIndex].value);

    console.log(" Booking Transport with:", { userId, pickup_location, dropoff_location, date, timeSlotId, vehicleId });

    if (!pickup_location || !dropoff_location || !date || !timeSlotId || !vehicleId) {
        console.error(" Missing required fields!", { pickup_location, dropoff_location, date, timeSlotId, vehicleId });
        alert(" Please fill in all required fields.");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/user/book-transport", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,  //  Now it's properly defined
                pickup_location,  
                dropoff_location, 
                date,
                time_slot_id: timeSlotId, 
                vehicle_id: vehicleId,    
            }),
        });

        console.log("📡 Raw Response:", res);

        const data = await res.json();
        console.log(" Booking Response:", data);

        if (!res.ok) {
            throw new Error(data.error || "Failed to book transport");
        }

        alert(" Transport booked successfully!");
    } catch (error) {
        console.error(" Booking Error:", error);
        alert(" Booking failed. Please try again.");
    }
}


// Call fetchVehicles when the page loads
document.addEventListener("DOMContentLoaded", fetchVehicles);

async function fetchTimeSlots() {
    const res = await fetch("http://localhost:5000/admin/time-slots");
    const time_slot = await res.json();

    let time_slotSelect = document.getElementById("time_slot");
    if (!time_slotSelect) {
        console.error(" Element #time_slot not found in the DOM.");
        return;
    }

    time_slotSelect.innerHTML = '<option value="">Select a Time Slot</option>'; // Default option

    time_slot.forEach(slot => {
        let option = document.createElement("option");
        option.value = slot.id; // Ensure the value is the ID, not the text
        option.textContent = slot.time;
        time_slotSelect.appendChild(option);
    });

    console.log(" Time Slots Loaded:", time_slot);
}

document.addEventListener("DOMContentLoaded", fetchTimeSlots);


async function fetchBookings() {
    const user = JSON.parse(sessionStorage.getItem("user")); // Use sessionStorage
    if (!user) return;

    try {
        const res = await fetch(`http://localhost:5000/user/bookings?user_id=${user.id}`);
        const data = await res.json();
        
        const bookings = Array.isArray(data.bookings) ? data.bookings : [];

        let bookingList = document.getElementById("bookingList");
        bookingList.innerHTML = "";

        bookings.forEach(booking => {
            bookingList.innerHTML += `<li>${booking.vehicle_no} - ${booking.time_slot_id}</li>`;
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

function logoutUser() {
    // Clear session storage
    sessionStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "index.html"; // Change to your actual login page
}

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        window.location.href = "index.html"; // Redirect to login if no user
    }
});


fetchVehicles();
fetchBookings();