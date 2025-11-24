function createCharts() {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];

    const totalVisitorsJanSep = 196894;
    const monthlyVisitors = [19689, 17721, 25596, 35441, 33472, 11814, 13783, 19689, 19689];

    const activities = ['Scuba Diving & Snorkel', 'Beach / Day-Trip / Resort', 'Island-Hopping', 'Shoreline Leisure'];
    const activityCounts = [Math.round(totalVisitorsJanSep * 0.55), Math.round(totalVisitorsJanSep * 0.25), Math.round(totalVisitorsJanSep * 0.12), Math.round(totalVisitorsJanSep * 0.08)];

    const spots = ['Anilao Reef', 'Isla Sombrero', 'Mt. Gulugod', 'Vivere Azure', 'Eagle Point', 'Pier Uno'];
    const spotVisits = [82721, 29534, 15751, 11813, 9845, 589] /* illustrative estimates */;

  // Bar chart: visits per spot
  const ctxBar = document.getElementById('visitsChart').getContext('2d');
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: spots,
      datasets: [{
        label: 'Estimated Visits',
        data: spotVisits,
        backgroundColor: spots.map((_,i) => `rgba(17,138,178,${0.9 - i*0.08})`),
        borderColor: 'rgba(17,138,178,0.9)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {legend:{display:false}, tooltip:{mode:'index', intersect:false}},
      scales: {y: {beginAtZero:true}}
    }
  });

  // Pie chart: activity distribution
  const ctxPie = document.getElementById('activitiesChart').getContext('2d');
  new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: activities,
      datasets: [{
        data: activityCounts,
        backgroundColor: ['#118ab2','#06d6a0','#ffd166','#ef476f','#8e9aaf']
      }]
    },
    options: {responsive:true, plugins:{legend:{position:'bottom'}}}
  });

  // Line chart: monthly visitors
  const ctxLine = document.getElementById('trendChart').getContext('2d');
  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Monthly Visitors',
        data: monthlyVisitors,
        borderColor: '#006d77',
        backgroundColor: 'rgba(0,109,119,0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      }]
    },
    options: {responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });
}

// When the DOM is ready, create charts
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createCharts);
} else {
  createCharts();
}
