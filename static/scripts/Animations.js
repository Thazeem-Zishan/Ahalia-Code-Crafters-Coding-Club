const navbarBrand = document.querySelector(".navbar-brand");
const navLink = document.querySelectorAll(".nav-link");
const logoPhrase = document.getElementById("Logo-Line");
const blinkingCursor = document.querySelector(".blinking-cursor");
const mainLogo = document.querySelector(".main-logo");
const body = document.querySelector("body");
const technocratzLogo = document.querySelector(".tech-logo");
const technocratzDescription = document.querySelector("#technocratz-description");
const slide = document.querySelector(".slide");
const technocratzDescriptionText = document.querySelector(".information-description");
const technocratzDescriptionTitle = document.querySelector("#code-crafters");

const tl = new TimelineMax();

let i = 0;
let txt = 'Coding Club'; /* The text */
let speed = 500; /* The speed/duration of the effect in milliseconds */
let random;
let spaceKeyAudio;
let normalKeyAudio;
let ticking = false;
let technocratzDescriptionTitleTriggered = false;
let scrollTop;
let percentage_scroll;
let aboutCycle = 0;
let vwOriginal = 1495;
let vhOriginal = 746;

function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
}


function getVisibilityDecrement(vw, vwRatio){
    let visibilityDecrement;
    if (vw <= 879) {
        visibilityDecrement = (percentage_scroll / 100) * 79.5 + (2.5 * ((459.2 * vwRatio) / (vw * vwRatio)));
    } else {
        visibilityDecrement = (percentage_scroll / 100) * 79.5;
    }
    return visibilityDecrement;
}


function descriptionTextTransitionAppear(scrollStart, totalValue, vw, vwRatio) {
    technocratzDescription.style.left = "10vw";
    technocratzDescription.style.width = "80vw";
    percentage_scroll = percentage((scrollTop - scrollStart), totalValue);
    let visibilityDecrement = getVisibilityDecrement(vw, vwRatio);
    technocratzDescriptionText.style.left = String(79.5 - visibilityDecrement).concat("vw");
}


function descriptionTextTransitionDisappear(scrollStart, totalValue, description, vw, vwRatio) {
    technocratzDescriptionText.innerHTML = description;
    percentage_scroll = percentage((scrollTop - scrollStart), totalValue);
    let visibilityDecrementDisappear = getVisibilityDecrement(vw, vwRatio);
    technocratzDescriptionText.style.left = String(0.5 - visibilityDecrementDisappear).concat("vw");
}


function makeTitleAppear(title, vw, vwRatio) {
    technocratzDescriptionTitleTriggered = true;
    technocratzDescriptionTitle.innerHTML = title;
    technocratzDescriptionText.style.left = "0.5vw";
    if (vw <= 879){
        technocratzDescriptionText.style.left = String(0.5 - (2.5 * ((459.2 * vwRatio) / (vw * vwRatio)))).concat("vw");
    }
    technocratzDescriptionTitle.classList.add("in-view");
    technocratzDescriptionTitle.classList.remove("not-in-view");
}


function makeTitleDisappear() {
    technocratzDescriptionTitle.classList.remove("in-view");
    technocratzDescriptionTitle.classList.add("not-in-view");
    technocratzDescriptionTitleTriggered = false;
}


function informationCardTransition() {
    percentage_scroll = percentage((scrollTop - 1000), 500);
    technocratzDescription.style.borderRadius = String(percentage_scroll / 10).concat("px");
    let visibilityDecrement = (percentage_scroll / 100) * 40;
    let visibilityIncrement = (percentage_scroll / 100) * 80;
    technocratzDescription.style.left = String(50 - visibilityDecrement).concat("vw");
    technocratzDescription.style.width = String(visibilityIncrement).concat("vw");
}


function nextCycle(description) {
    technocratzDescriptionText.style.left = "80vw";
    technocratzDescriptionText.innerHTML = description;
    aboutCycle++;
}


function cycle(start, title, description, cycleNumber, vw, vwRatio) {
    if (scrollTop < start && aboutCycle !== 0) {
        if (aboutCycle !== cycleNumber && aboutCycle > cycleNumber) {
            aboutCycle--;
        }
    }
    if (scrollTop < start + 500 && aboutCycle === cycleNumber && technocratzDescriptionTitleTriggered) {
        makeTitleDisappear();
    }
    if (scrollTop >= 1000 && scrollTop <= 1500) {
        informationCardTransition();
    } else if (scrollTop >= start && aboutCycle === cycleNumber - 1) {
        nextCycle(description);
    } else if (scrollTop >= start && scrollTop <= start + 500) {
        descriptionTextTransitionAppear(start, 500, vw, vwRatio);
    } else if (scrollTop >= start + 500 && scrollTop <= start + 1000 && !technocratzDescriptionTitleTriggered) {
        makeTitleAppear(title, vw, vwRatio);
    } else if (scrollTop >= start + 1000 && technocratzDescriptionTitleTriggered && aboutCycle === cycleNumber) {
        makeTitleDisappear();
    } else if (scrollTop >= start + 1000 && scrollTop <= start + 1500) {
        descriptionTextTransitionDisappear(start + 1000, 500, description, vw, vwRatio);
        aboutCycle = cycleNumber;
    } else if (scrollTop > start + 1500 && aboutCycle === cycleNumber) {
        technocratzDescriptionText.style.left = "80vw";
    }
}


blinkingCursor.style.left = "41.1vw"
logoPhrase.innerHTML = ""

tl.from(navbarBrand, 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
    .from(navLink[0], 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
    .from(navLink[1], 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
    .from(navLink[2], 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut});


document.addEventListener("DOMContentLoaded", () => {
    // Use Intersection Observer to determine if objects are within the viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                return;
            }
            entry.target.classList.remove('in-view');
        });
    });

    // Get all the elements with the .animate class applied
    const allAnimatedElements = document.querySelectorAll('.animate');

    // Add the observer to each of those elements
    allAnimatedElements.forEach((element) => observer.observe(element));

});


window.addEventListener("scroll", function (e) {
    scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (!ticking) {
        window.requestAnimationFrame(function () {
            // document.getElementById("scroll-value").innerHTML = Math.round(scrollTop);
            console.log(scrollTop);
            let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
            let vwRatio = 100 / vw;
            let vhRatio = 100 / vh;
            console.log(vw);
            if (technocratzDescription.classList[technocratzDescription.classList.length - 1] === "in-view") {
            }
            if (vw <= 879) {
                console.log(technocratzDescription.style.height);
                technocratzDescription.style.height = String(50 + ((879 - vw) / 1.4) * vhRatio).concat("vh")
            } else {
                technocratzDescription.style.height = "50vh"
            }
            if (scrollTop < 1000) {
                technocratzDescription.style.width = "0";
            }

            if (scrollTop >= 1000 && scrollTop <= 9000) {
                slide.style.marginTop = String(((300 + (scrollTop - 1000)) + ((vwOriginal - vw) / 4)) * vwRatio).concat("vw");
                cycle(1500, "Code Crafters", "Code Crafter is the official coding club and the premier coding community in our department, managed by the Computer Science Department association, Technocratz (2024-2025). We are dedicated to empowering students through competitive programming, collaboration, and innovation.Whether you're a beginner eager to learn the basics or an experienced coder looking to sharpen your skills, our club provides a collaborative and competitive environment to help you achieve your goals.", 1, vw, vwRatio);
                cycle(3000, "Our Mission", "Our mission is to foster a passion for coding and problem-solving among students. We aim to provide a platform where members can learn, grow, and compete while building real-world coding skills that are crucial for their future careers.", 2, vw, vwRatio);
                cycle(4500, "What We Offer", "At CodeCrafters, we are dedicated to organizing engaging, competition-focused events that challenge our members and drive continuous learning. Here’s what we offer:<br><br><strong>Coding Tournaments:</strong> Regular competitive coding events with live leaderboards, and challenging problems for top performers.<br><br>" +
                    "<strong>Tech Quizzes:</strong> Fun and informative quizzes focused on algorithms, data structures, programming languages, and the latest tech trends.\n", 3, vw, vwRatio);
                cycle(6000, "What We Offer", "<strong>Peer-to-Peer Learning(Latter update):</strong> Opportunities to collaborate with peers on projects and problem-solving activities.<br><br><strong>Workshops and Tutorials:</strong> Learn new languages, frameworks, and technologies through hands-on sessions.", 4, vw, vwRatio);
                // } else if (scrollTop > 1030) {
                //     technocratzDescription.style.rotate = "0deg";
                //     technocratzDescription.style.left = "57vw";
                // } else if (scrollTop < 545) {
                //     technocratzDescription.style.rotate = "270deg";
                //     technocratzDescription.style.left = "91vw";
                // }
            }
            ticking = false;

        });

        ticking = true;
    }
});

function typeWriter() {
    if (i < txt.length) {
        random = Math.floor((Math.random() * 6) + 1);
        if (txt.charAt(i) === " ") {
            spaceKeyAudio = new Audio("/static/audio/Space.mp3");
            spaceKeyAudio.volume = 0.5;
            spaceKeyAudio.play();
        } else {
            if (random === 6) {
                random--;
            }
            normalKeyAudio = new Audio("/static/audio/".concat("", String(random), ".mp3"));
            normalKeyAudio.volume = 0.5;
            normalKeyAudio.play();
        }
        if (txt.charAt(i) === "i" || txt.charAt(i) === " " || txt.charAt(i) === "l") {
            blinkingCursor.style.left = String(Number(blinkingCursor.style.left.split("v")[0]) + 1.3)
                .concat("", "vw");
        } else {
            blinkingCursor.style.left = String(Number(blinkingCursor.style.left.split("v")[0]) + 2.85)
                .concat("", "vw");
        }
        logoPhrase.innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        blinkingCursor.src = '/static/GIFs/BlinkingCursorWhite Cropped.gif'
    }
}

typeWriter()

//This website was made my Thazeem Zishan Ali Akbar.