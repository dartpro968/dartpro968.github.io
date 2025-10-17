// // ==============================================================================

// // GSAP 

// // ==============================================================================



gsap.from(['#bran_logo','#menu'],
    {
        duration:1.5,
        x:"-100%",
        opacity:0,
        ease:'power4.out',
        stagger:0.2,
        
    });

// gsap.from(['#main_heading'],{
// duration:1.5,
//         y:"-100%",
//         opacity:0,
//         delay:0.5,
//         ease:'power4.out',
//         stagger:0.2,
// });


// // gsap.from(['#right'],{
// // duration:1.5,
// //         x:"100%",
// //         opacity:0,
// //         delay:0.9,
// //         ease:'power4.out',
// //         stagger:0.2,
// // });
gsap.registerPlugin(ScrollTrigger);

gsap.to(["#right", "#left", ".img1", ".img2",'#call_to_action'], {
  scrollTrigger: {
    trigger: "#call_to_action",
    start: "top 70%",
    end: "bottom 30%",
    toggleActions: "play reverse play reverse",
    scrub: 1, // 👈 smooth scroll-linked motion
   
  },
  x: "-2000", // 👈 smaller, realistic movement (not -500%)
  duration: 1,
  opacity:0.8,
  ease: "power4.out",
});

gsap.to(".label", {
  scrollTrigger: {
    trigger: "#hero_2nd",
    start: "top 100%",
    end: "bottom 30%",
    toggleActions: "play reverse play reverse",
    scrub: 1, // 👈 smooth scroll-linked motion
   
  },
  x: "-2000", // 👈 smaller, realistic movement (not -500%)
  duration: 1,
  opacity:0.5,
  ease: "power4.out",
});


gsap.to("#hero_2nd", {
  scrollTrigger: {
    trigger: ".service_section",
    start: "top 100%",
    end: "bottom 30%",
    toggleActions: "play reverse play reverse",
    scrub: 1, // 👈 smooth scroll-linked motion
    
  },
  x: "-2000", // 👈 smaller, realistic movement (not -500%)
  duration: 1,
  opacity:0.5,
  ease: "power4.out",
});

gsap.to([".service_section",".eclips31",".eclips41"], {
  scrollTrigger: {
    trigger: ".team_section",
    start: "top 100%",
    end: "bottom 30%",
    toggleActions: "play reverse play reverse",
    scrub: 1, // 👈 smooth scroll-linked motion
    
  },
  x: "-2000", // 👈 smaller, realistic movement (not -500%)
  duration: 1,
  opacity:0.5,
  ease: "power4.out",
});


// gsap.to(['#right', '#call_to_action', '#left'], {
//   scrollTrigger: {
//     trigger: '.label',
//     start: "top 90%",           // adjust as needed
//     end: "bottom 30%",
//     //this helps to reverse the action when one go back in trigger
//     toggleActions: "play reverse play reverse", // 👈 key line
//     markers: true,              // optional, for debugging
//   },
//   x: '-50%',
//   opacity: 0,
//   duration: 0.5,
//   ease: "power2.out"
// });


// // gsap.to(".img1", {
// //   scrollTrigger: {
// //     trigger: ".label",      // section that controls scroll
// //     start: "top top",       // when top of trigger hits top of viewport
// //     end: "bottom top",      // when bottom of trigger hits top of viewport
// //     scrub: true,            // 👈 tie animation to scroll progress
// //     pin: false,             // true if you want it fixed while scrolling
// //     markers: true           // for debugging
// //   },   // final position  // optional fade out
// //   ease: "none" // smooth linear motion along scroll
// // });





// //     // to add plugin in our website we can use register plugin 


// // gsap.from('.main',
// //     {
// //         duration:1,
// //         y:"-100%",
// //         opacity:0,
// //         ease:'bounce',
// //         background:'red',
// //     })

// // gsap.from('.text',
// //     {
// //         delay:1,
// //         duration:1,
// //         x:"-100%",
// //         opacity:0,
// //     })

// //     gsap.from('.text>p',
// //         {
// //             delay:1,
// //             duration:2,
// //             x:"-100%",
// //             opacity:1,
// //         })



// // gsap.to(".img_12",{
// //     opacity:0.5
// //     })


// //     gsap.from('.box', {
// //         // "scroll trigger is value given to the element we want to trigger"
// //         // for example we want to animate .box when box2 enter in view port
// //         //BOX WILL START ANIMAING WHEN BOX2 COMES IN VIEW PORT
// //         scrollTrigger: '.box2', 
      
// //         opacity:0,
       
// //     });
    

// //     gsap.to('.box', {
// //         // "scroll trigger is value given to the element we want to trigger"
// //         // for example we want to animate .box when box2 enter in view port
// //         //BOX WILL START ANIMAING WHEN BOX2 COMES IN VIEW PORT
// //         scrollTrigger: '.box2', 
// //         width:'500px',
// //         opacity:1,
// //         borderRadius:0,
// //         x:'-200px' ,
// //     });

// //     gsap.from('.box3', {
// //         // "scroll trigger is value given to the element we want to trigger"
// //         // for example we want to animate .box when box2 enter in view port
// //         //BOX WILL START ANIMAING WHEN BOX2 COMES IN VIEW PORT
// //         scrollTrigger: '.box2', 
      
// //         opacity:0,
       
// //     });
    

// //     gsap.to('.box3', {
// //         // "scroll trigger is value given to the element we want to trigger"
// //         // for example we want to animate .box when box2 enter in view port
// //         //BOX WILL START ANIMAING WHEN BOX2 COMES IN VIEW PORT
// //         scrollTrigger: '.box4', 
// //         width:'500px',
// //         opacity:1,

// //         borderRadius:0,
// //         x:'200px' ,
// //     });