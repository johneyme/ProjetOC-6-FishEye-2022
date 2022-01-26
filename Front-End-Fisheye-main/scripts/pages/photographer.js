const api = "./data/photographers.json";

fetch(api)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displayProfile(data.photographers);
    displayData(data.media);
    lightboxController();
    lightbox();
  });

// ------------------  FONCTIONS QUI AFFICHE LES INFOS DU PHOTOGRAPHES -------------

async function displayProfile(photographers) {
  const profileSection = document.querySelector(".photograph-profile");
  const spanPrice = document.querySelector(".span-price-aside");
  const spanNameForm = document.querySelector(".span-name-form");

  photographers.forEach((photographer) => {
    if (photographer.id == idValue) {
      const profileModel = profileFactory(photographer);
      const profileCardDOM = profileModel.getProfileDOM();
      profileSection.appendChild(profileCardDOM);
      spanPrice.innerHTML = photographer.price;
      spanNameForm.innerHTML = photographer.name;
    }
  });
}

// ----------------- FONCTIONS LES MEDIAS DU PHOTOGRAPH -----------------------------------

async function displayData(medias) {
  const mediasSection = document.querySelector(".media_section");
  const spanCountLike = document.querySelector(".span-count-like");
  const orderbySelect = document.querySelector("#orderby");

  let count = 0;
  let mediaArray = [];

  medias.forEach((media) => {
    if (media.photographerId == idValue) {
      mediaArray.push(media);
    }
  });

  mediaArray.sort(function (a, b) {
    if (a.title < b.title) {
    return -1 }
  });



  // ----------------- SYSTEME DE TRI ------------------------

  orderbySelect.addEventListener("change", function () {
    // Tri par Likes
    if (this.value == "likes") {
      mediaArray.sort(function (a, b) {
        return a.likes - b.likes;
      });
      mediasSection.innerHTML = "";
      affichageMedia();
      mediaLoading = [];
      lightbox();

      // Tri par date  --- A FAIRE ---
    } else if (this.value == "date") {
      mediaArray.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      mediasSection.innerHTML = "";
      affichageMedia();
      mediaLoading = [];
      lightbox();
      // Tri par alphabétique --- A FAIRE ---
    } else if (this.value == "alphabetique") {
      mediaArray.sort(function (a, b) {
        if (a.title < b.title) {
        return -1 }
      });
      mediasSection.innerHTML = "";
      affichageMedia();
      mediaLoading = [];
      lightbox();
    }
  });

  affichageMedia();

  //  ----------------- AFFICHAGE MEDIA VIA mediaArray ---------------------

  function affichageMedia() {
    mediaArray.forEach((media) => {
      const mediaModel = mediaFactory(media);
      const userCardDOM = mediaModel.getUserProfileDOM();
      mediasSection.appendChild(userCardDOM);
      count += media.likes;
    });
  }

  spanCountLike.innerHTML = count;
}

// --------------------- LIGHTBOX ----------------------------

let url = null;
let indexMedia = 0;
let mediaLoading = [];

// AFFICHAGE LIGHTBOX

function lightbox() {
  const mediaSelector = document.querySelectorAll(
    '#single-media > img[src$=".jpg"], img[src$=".jpeg"]'
  );
  const lightboxSelector = document.querySelector(".lightbox");
  const lightboxSrc = document.querySelector(".lightbox-img");

  mediaSelector.forEach((source) => mediaLoading.push(source.currentSrc));

  mediaSelector.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      let srcLink = link.currentSrc;
      lightboxSelector.style.display = "block";
      lightboxSrc.setAttribute("src", srcLink);
      url = srcLink;
      indexMedia = mediaLoading.findIndex((media) => media === url);
    })
  );
}

//  FONCTION CONTROLE DE LA LIGHTBOX

function lightboxController() {
  const lightboxSelector = document.querySelector(".lightbox");
  const lightboxSrc = document.querySelector(".lightbox-img");
  const lightboxClose = document.querySelector(".lightbox__close");
  const lightboxNext = document.querySelector(".lightbox__next");
  const lightboxPrev = document.querySelector(".lightbox__prev");

  // Fleche suivante Lightbox
  lightboxNext.addEventListener("click", function (e) {
    e.preventDefault();
    if (indexMedia < mediaLoading.length - 1) {
      indexMedia++;
      lightboxSrc.setAttribute("src", mediaLoading[indexMedia]);
    }
  });

  // Fleche précédent Lightbox
  lightboxPrev.addEventListener("click", function (e) {
    e.preventDefault();
    if (indexMedia > 0) {
      indexMedia--;
      lightboxSrc.setAttribute("src", mediaLoading[indexMedia]);
    }
  });

  // Fermeture Ligthbox
  lightboxClose.addEventListener("click", function () {
    lightboxSelector.style.display = "none";
  });
}
