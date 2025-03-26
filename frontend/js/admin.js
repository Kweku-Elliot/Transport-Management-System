// Fetch and Display Drivers
async function fetchDrivers() {
    const res = await fetch("http://localhost:5000/admin/drivers");
    const drivers = await res.json();
    
    let driverSelect = document.getElementById("driverSelect");
    driverSelect.innerHTML = "";
    
    let driverList = document.getElementById("driversList");
    driverList.innerHTML = "";
    
    drivers.forEach(driver => {
        driverSelect.innerHTML += `<option value="${driver.id}">${driver.name}</option>`;
        driverList.innerHTML += `<li>${driver.name} - ${driver.phone}</li>`;
    });
}

// Fetch and Display Vehicles
async function fetchVehicles() {
    const res = await fetch("http://localhost:5000/admin/vehicles");
    const vehicles = await res.json();
    
    let vehicleList = document.getElementById("vehiclesList");
    vehicleList.innerHTML = "";
    
    vehicles.forEach(vehicle => {
        vehicleList.innerHTML += `<li>${vehicle.vehicle_no} (Driver: ${vehicle.driver_name})</li>`;
    });
}

// Add Driver
async function addDriver(event) {
    event.preventDefault();
    const name = document.getElementById("driverName").value;
    const phone = document.getElementById("driverPhone").value;

    await fetch("http://localhost:5000/admin/add-driver", {  //  Correct endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
    });

    alert("Driver added successfully!");
    fetchDrivers();
}

// Add Vehicle
async function addVehicle(event) {
    event.preventDefault();
    const vehicle_no = document.getElementById("vehicleNo").value;
    const driver_id = document.getElementById("driverSelect").value;

    await fetch("http://localhost:5000/admin/add-vehicle", {  //  Correct endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle_no, driver_id })
    });

    alert("Vehicle added successfully!");
    fetchVehicles();
}

async function fetchBookings() {
    const res = await fetch("http://localhost:5000/admin/bookings");
    const data = await res.json();
    
    if (!data.bookings) {
        console.error("No bookings found or incorrect response format");
        return;
    }

    let bookingList = document.getElementById("bookingList");
    bookingList.innerHTML = "";

    data.bookings.forEach(booking => {
        bookingList.innerHTML += `
            <li>
                ${booking.user_name} - ${booking.vehicle_no} - ${booking.time_slot}
            </li>
        `;
    });
}

// Fetch and display time slots
async function fetchTimeSlots() {
    const res = await fetch("http://localhost:5000/admin/time-slots");
    const timeSlots = await res.json();

    let timeSlotsList = document.getElementById("timeSlotsList");
    timeSlotsList.innerHTML = "";

    timeSlots.forEach(slot => {
        timeSlotsList.innerHTML += `
            <li>
                ${slot.time} 
                <button onclick="deleteTimeSlot(${slot.id})">Delete</button>
            </li>
        `;
    });
}

// Add a new time slot
async function addTimeSlot(event) {
    event.preventDefault();
    const newTime = document.getElementById("newTimeSlot").value;

    const res = await fetch("http://localhost:5000/admin/time-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: newTime })
    });

    if (res.ok) {
        document.getElementById("newTimeSlot").value = "";
        fetchTimeSlots();
    } else {
        alert("Error adding time slot");
    }
}

// Delete a time slot
async function deleteTimeSlot(id) {
    await fetch(`http://localhost:5000/admin/time-slots/${id}`, {
        method: "DELETE"
    });
    fetchTimeSlots();
}

// Load time slots on page load
fetchTimeSlots();
fetchBookings();

// Load data on page load
fetchDrivers();
fetchVehicles();


function AdminlogoutUser() {
    sessionStorage.removeItem("user"); // Remove user data from sessionStorage
    window.location.href = "adminLogin.html"; // Redirect to the login page
}
