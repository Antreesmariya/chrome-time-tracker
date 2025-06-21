const productiveSites = ['github.com', 'stackoverflow.com', 'leetcode.com'];

chrome.storage.local.get(null, (data) => {
  const report = document.getElementById('report');
  for (let site in data) {
    const seconds = Math.floor(data[site] / 1000);
    const li = document.createElement('li');
    const isProductive = productiveSites.includes(site);
    li.textContent = `${site}: ${seconds}s - ${isProductive ? '[Productive]' : '[Unproductive]'}`;
    li.style.color = isProductive ? 'green' : 'red';
    report.appendChild(li);
  }
});


// Clear data button
document.getElementById('clear').onclick = () => {
  chrome.storage.local.clear(() => {
    alert("Data cleared!");
    location.reload();
  });
};
