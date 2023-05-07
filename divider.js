/*
window.onload = () => {
  const leftSection = document.querySelector(".editor-holder");
  const divider = document.querySelector(".divider");
  const rightSection = document.querySelector(".preview-holder-wrapper");
  draggingElement(leftSection, divider, rightSection);
};

function draggingElement(first, element, second) {
    
  const rightSectionInside = document.querySelector(".preview-holder");  
  
  if (rightSectionInside){
    console.log(123);  
  } else {
    console.log("asdasdasd");    
  }
  
  // відстеження положення курсору
  const drag = { x: 0, y: 0 };
  const delta = { x: 0, y: 0 };

  // щоразу викликається, коли відбувається подія натискання кнопки миші
  function mouseDownHandler(e) {
    drag.x = e.clientX;
    drag.y = e.clientY;

    function mouseUpHandler() {
        document.body.style.removeProperty("cursor");
        first.style.removeProperty("user-select");
        second.style.removeProperty("user-select");
        
        // видалення прослуховувачів подій руху і відпускання вказівника миші
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
    };
    
    // прослуховувачі подій руху і відпускання вказівника миші
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  }

  function mouseMoveHandler(e) {  
    const currentX = e.clientX;
    const currentY = e.clientY;

    delta.x = currentX - drag.x;
    delta.y = currentY - drag.y;
    
    let firstWidth = first.getBoundingClientRect().width;
    let secondWidth = second.getBoundingClientRect().width;

    drag.x = currentX;
    drag.y = currentY;
    
    let newFirstWidth =
      ((firstWidth + delta.x) * 100) / element.parentNode.getBoundingClientRect().width;
    let newSecondWidth =
      ((secondWidth - delta.x) * 100) / element.parentNode.getBoundingClientRect().width;
    
    first.style.width = `${newFirstWidth}%`;
    second.style.width = `${newSecondWidth}%`;
  }

  // прослуховувач події натискання миші
  element.addEventListener("mousedown", mouseDownHandler);
  
}
*/