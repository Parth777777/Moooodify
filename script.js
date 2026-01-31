const title=document.getElementById("titlechanger");
const titlecombinations = [
 " M😂😍🥲😎dify","M🙃☹️😖😭dify","M😨😡🤒😱dify","M🤗🙄😓😤dify",];
let currentIndex=0;


title.addEventListener("mouseenter", () => {
      currentIndex = (currentIndex + 1) % titlecombinations.length;
      title.textContent = titlecombinations[currentIndex];
    });

  
document.getElementById("getStarted").addEventListener("click", () => {
  window.location.href = "mainpage.html";
});
