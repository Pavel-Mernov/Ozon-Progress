class Progress {
  constructor(container) {
    this.container = container;

    this.value = 0;
    this.animated = false;

    this.size = 160;
    this.strokeWidth = 10;
    this.radius = (this.size - this.strokeWidth) / 2;
    this.circumference = 2 * Math.PI * this.radius;

    this.init();
  }

  init() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    
    this.bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.bg.setAttribute("cx", this.size / 2);
    this.bg.setAttribute("cy", this.size / 2);
    this.bg.setAttribute("r", this.radius);
    this.bg.setAttribute("fill", "none");
    this.bg.setAttribute("stroke-width", this.strokeWidth);
    this.bg.classList.add("progress-bg");

    
    this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.circle.setAttribute("cx", this.size / 2);
    this.circle.setAttribute("cy", this.size / 2);
    this.circle.setAttribute("r", this.radius);
    this.circle.setAttribute("fill", "none");
    this.circle.setAttribute("stroke-width", this.strokeWidth);
    this.circle.classList.add("progress-bar");

    this.circle.style.strokeDasharray = this.circumference;
    this.circle.style.strokeDashoffset = this.circumference;

    this.svg.appendChild(this.bg);
    this.svg.appendChild(this.circle);

    this.container.appendChild(this.svg);
  }


  setValue(value) {
    const val = Math.max(0, Math.min(100, Number(value)));
    this.value = val;

    const offset = this.circumference * (1 - val / 100);
    this.circle.style.strokeDashoffset = offset;
  }

  setAnimated(flag) {
    this.animated = flag;

    if (flag) {
      this.circle.classList.add("rotating");
    } else {
      this.circle.classList.remove("rotating");
    }
  }

  setHidden(flag) {
    if (flag) {
      this.container.classList.add("hidden");
    } else {
      this.container.classList.remove("hidden");
    }
  }
}



const progress = new Progress(document.getElementById("progress"));

const valueInput = document.getElementById("valueInput");
const animateToggle = document.getElementById("animateToggle");
const hideToggle = document.getElementById("hideToggle");

valueInput.addEventListener("input", (e) => {
  progress.setValue(e.target.value);
});

animateToggle.addEventListener("change", (e) => {
  progress.setAnimated(e.target.checked);
});

hideToggle.addEventListener("change", (e) => {
  progress.setHidden(e.target.checked);
});


progress.setValue(25);


// Additional feature: Load/Reset button

const loadResetBtn = document.getElementById("loadResetBtn");

let interval = null;

let loadedState = 'normal'; // 'normal', 'loading', 'loaded'

loadResetBtn.addEventListener("click", () => {

    if (loadedState === 'normal') {
    if (interval) return;

    

    loadedState = 'loading';
    loadResetBtn.textContent = 'Loading...';
    loadResetBtn.disabled = true;

    valueInput.disabled = true;
    

    interval = setInterval(() => {
        if (progress.value >= 100) {
            clearInterval(interval);
            
            interval = null;
            
            loadedState = 'loaded';
            loadResetBtn.textContent = 'Reset';
            loadResetBtn.disabled = false;

            valueInput.disabled = false;

            progress.setAnimated(false);
            
            animateToggle.checked = false;
            animateToggle.disabled = true;

            return;
        }

        progress.setValue(progress.value + 1);
    
        
    }, 100);
    }
    else if (loadedState === 'loaded') {
        progress.setValue(valueInput.value);
        loadedState = 'normal';
        loadResetBtn.textContent = 'Load';
        loadResetBtn.disabled = false;

        animateToggle.disabled = false;
    }
});