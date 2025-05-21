// Alert on load to confirm script execution
alert("Claude Branch Extension loaded!");

// Make a very basic modification to the page
document.body.style.border = "5px solid red";

// Add an absolutely positioned element that should appear regardless of iframe structure
const indicator = document.createElement('div');
indicator.innerHTML = "CLAUDE BRANCH ACTIVE";
indicator.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  background-color: red;
  color: white;
  padding: 10px;
  font-size: 20px;
  z-index: 99999999;
  border: 3px solid black;
`;
document.body.appendChild(indicator);

console.log("Claude Branch Extension modification complete");