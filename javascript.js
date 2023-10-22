 // include sections as separate html files  

// Open the Modal art gallery functions -- START
function openModal() {
   $("#myModal").css("display","block");
  }
  
  // Close the Modal
  function closeModal() {
    $("#myModal").css("display","none");
  }
    
  var slideIndex = 1;
  showSlides(slideIndex);
  // Next&previous controls
  function plusSlides(n) {
    showSlides(slideIndex += n);
  }
  
  $(document).on('keydown', function(event) {
    if (event.keyCode == 27) {
      closeModal();
    }
});

  $(document).on('keyup', function(event) {
    if (event.keyCode == '39') {
      plusSlides(1); //next - right arrow key
    }
    else if (event.keyCode == '37') {
      plusSlides(-1); //prev- leftarrow key
    } 
  });

  // Thumbnail image controls
  function currentSlide(n) {
    showSlides(slideIndex = n);
  }
  

  var locked = false;
 
  function showSlides(n) {
    var artgallery=$(".gallery-item");
    var slides =$(".mySlides");
    var thumbnails = $(".demo"); //thumbnail section
    var slidenr=$(".numbertext")
    var captions = $(".captions ");
    var captionText = $("#slidecaption");

    if (n > artgallery.length) {slideIndex = 1;}
    if (n < 1)                 {slideIndex = artgallery.length;}

      slides.css("display","none");
      thumbnails.removeClass("active");
      
      var targetart="images/art/img"+slideIndex+".jpg";
      $(".slideImg").attr("src",targetart); 

    slides.fadeToggle(500);//fades-in slide
    slides.css("display","block");//slide is made visible

    var thumbIndex=0; var x =0;   
   for(var i=-2; i<=2; i++){ //for loop assigns the thumbnails under each Slide, so that the thumbnails are the 2 previous art images + the next 2 art images
    if(i!=0){ //skips i==0 so not to include the Slide image
      if(slideIndex==1 && i<0 || slideIndex==2 && i<-1 ){ // exception for the first two elements
         thumbIndex=artgallery.length+slideIndex+i; 
        }
      else if(slideIndex == artgallery.length && i>0 || slideIndex == artgallery.length-1 && i>1 ){// exception for the last two elements
         thumbIndex=slideIndex-artgallery.length+i;
        }
      else{ 
         thumbIndex=slideIndex+i; //general case
        }  //console.log("i="+i+" thumbIndex="+thumbIndex+" x="+x);
     thumbnails.eq(x).attr("src","images/art/img"+thumbIndex+".jpg");
     thumbnails.eq(x).attr("onclick","currentSlide("+thumbIndex+")"); //edits one by one the thumbnails image source and onclick at the bottom
     x++;
   }}
    
   thumbnails.eq(slideIndex-1).addClass("active"); // 
   slidenr.text(slideIndex+"/"+artgallery.length); //slides are numbered automatically
   captionText.html(captions.eq(slideIndex-1).html());
   captionText.addClass(".captions"); //takes the hidden captions and adds them on the slide
  }
  //art gallery functions -- END
 




 