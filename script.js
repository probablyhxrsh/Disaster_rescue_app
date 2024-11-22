// Initialize Camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    const camera = document.getElementById("camera");
    camera.srcObject = stream;
  })
  .catch(err => {
    alert("Camera access denied. Please enable it to use this feature.");
    console.error(err);
  });

// Add Emergency Contacts
document.getElementById("addContact").addEventListener("click", () => {
  const name = document.getElementById("contactName").value.trim();
  const number = document.getElementById("contactNumber").value.trim();

  if (!name || number.length !== 10 || isNaN(number)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  const contactList = document.getElementById("contactList");
  const li = document.createElement("li");
  li.textContent = `${name}: ${number}`;
  contactList.appendChild(li);

  document.getElementById("contactName").value = "";
  document.getElementById("contactNumber").value = "";
});

// SOS Button
document.getElementById("sos-button").addEventListener("click", () => {
  alert("SOS alert sent to emergency responders!");
  // Add backend messaging API integration here.
});

// Initialize Google Maps with User's Live Location
function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Initialize the map centered on the user's location
        const map = new google.maps.Map(document.getElementById("map"), {
          center: userLocation,
          zoom: 14,
        });

        // Add a Marker for the user's location
        new google.maps.Marker({
          position: userLocation,
          map,
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          },
        });

        // Fetch Nearby Emergency Services (Hospitals)
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(
          {
            location: userLocation,
            radius: 2000, // Search within 2 km radius
            type: ["hospital"], // Only hospitals
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              results.forEach(place => {
                const marker = new google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                });

                const infoWindow = new google.maps.InfoWindow({
                  content: `<h3>${place.name}</h3><p>${place.vicinity}</p>`,
                });

                marker.addListener("click", () => {
                  infoWindow.open(map, marker);
                });
              });
            } else {
              console.error("Places Service Error:", status);
              alert("Failed to load nearby hospitals.");
            }
          }
        );
      },
      error => {
        alert("Error getting your location.");
        console.error(error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Show the Section Based on Nav Click
function setActiveNav(navId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.style.display = 'none');
  const activeSection = document.getElementById(navId);
  if (activeSection) {
    activeSection.style.display = 'block';
  }

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  const activeNavItem = document.getElementById(`${navId}-nav`);
  if (activeNavItem) {
    activeNavItem.classList.add('active');
  }
}

// Event listeners for nav items
document.getElementById("home-nav").addEventListener("click", () => setActiveNav("home"));
document.getElementById("camera-nav").addEventListener("click", () => setActiveNav("camera-container"));
document.getElementById("map-nav").addEventListener("click", () => setActiveNav("map-container"));
document.getElementById("contacts-nav").addEventListener("click", () => setActiveNav("contacts-section"));
document.getElementById("sos-nav").addEventListener("click", () => setActiveNav("sos-section"));

// Initialize Map on window load
window.onload = () => {
  initMap();
  setActiveNav("home"); // Default view on page load
};
