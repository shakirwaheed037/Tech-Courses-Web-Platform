document.addEventListener("DOMContentLoaded", loadCourses);

async function loadCourses() {
  const courseList = document.getElementById("course-list");
  courseList.innerHTML = "Loading courses ...";

  try {
    const res = await fetch("http://localhost:5000/api/courses");
    const courses = await res.json();

    courseList.innerHTML = courses.map(course => `
      <div class="course-card">
        <img src="${course.image}" alt="${course.title}" />
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <button onclick="enroll('${course._id}')">Enroll</button>
      </div>
    `).join("");
  } catch (error) {
    courseList.innerHTML = "Failed to load courses.";
  }
}

async function enroll(courseId) {
  alert(`Enroll clicked for course ID: ${courseId}`);

}
