$(document).ready(function () {
    $(".text h1 span, bottom_text h5, .description .wrapper h2").lettering();

    var tl = gsap.timeline();

    tl.from(".text h1 span", {
      x: -20,
      duration: 1,
      opacity: 0,
      stagger: 0.1,
    })
    .from(".ggl", {
      y: 20,
      duration: 1,
      opacity: 0,
      stagger: 0.06,
    })
    .from(".google", {
      y: 20,
      duration: 1,
      opacity: 0,
      stagger: 0.06,
    })
      .from(".bottom_text h5  ", {
        y: 20,
        duration: 1,
        opacity: 0,
        stagger: 0.09,
      })
      .from(".bottom_text a  ", {
        y: -20,
        duration: 1,
        opacity: 0,
        stagger: 0.09,
      })
      .from("header .logo", {
        y: -20,
        duration: 1,
        opacity: 0,
      })
      .from("header nav li", {
        x: -20,
        duration: 0.6,
        opacity: 0,
        stagger: 0.07,
      })

  });