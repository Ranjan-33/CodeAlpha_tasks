function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += previousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

// Function to get the day of the week for a date
function getDayOfWeek(dateString) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
}

// Function to calculate the number of days until next birthday
function daysUntilNextBirthday(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diff = nextBirthday - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

// Function to fetch historical events from Wikipedia API
async function fetchHistoricalEvents(month, day) {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const indianKeywords = [
      "India",
      "Indian",
      "Delhi",
      "Mahatma Gandhi",
      "Independence",
      "British India",
      "Hindustan",
      "Indian Army",
      "New Delhi",
      "Mumbai",
      "Bengal",
      "Jawaharlal Nehru",
      "Bharat",
      "Modi",
      "nehru",
      "Hindustan",
    ];

    const indianEvents = data.events.filter((event) => {
      return indianKeywords.some((keyword) => event.text.includes(keyword));
    });

    if (indianEvents.length === 0) {
      return "No significant Indian historical events found on this day.";
    }

    const events = indianEvents.slice(0, 3).map((event) => event.text);
    return events.join("<br>");
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return "No historical events found.";
  }
}

// Handling form submission
document
  .getElementById("ageForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Show loader
    document.getElementById("loader").style.display = "block";
    document.querySelector(".result-container").style.display = "none";

    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;

    if (dob) {
      const age = calculateAge(dob);
      const dayOfWeek = getDayOfWeek(dob);
      const daysUntilBirthday = daysUntilNextBirthday(dob);

      const birthDate = new Date(dob);
      const month = birthDate.getMonth() + 1; // Months are 0-indexed
      const day = birthDate.getDate();

      // Fetch historical events for the birthdate
      const historicalEvents = await fetchHistoricalEvents(month, day);

      // Update results
      document.getElementById(
        "ageResult"
      ).innerHTML = `<strong>${name}</strong>, you are <strong>${age.years}</strong> years, <strong>${age.months}</strong> months, and <strong>${age.days}</strong> days old!`;
      document.getElementById(
        "dayResult"
      ).innerHTML = `You were born on a <strong>${dayOfWeek}</strong>.`;
      document.getElementById(
        "eventResult"
      ).innerHTML = `<strong>Indian Historical Events on your Birthday:</strong><br>${historicalEvents}`;
      document.getElementById(
        "birthdayResult"
      ).innerHTML = `There are <strong>${daysUntilBirthday}</strong> days left until your next birthday!`;

      // Hide loader and show results
      document.getElementById("loader").style.display = "none";
      document.querySelector(".result-container").style.display = "block";
    } else {
      alert("Please enter a valid date of birth.");
    }
  });
