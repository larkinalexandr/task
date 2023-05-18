/* eslint-disable */
import {fetchApi} from '../utils/fetch.js';

const initMapTwo = () => {
  const mapTwo = document.querySelector('#map-two');

  if (!mapTwo) {
    return;
  }

  ymaps.ready(init);

  function init() {

    const map = new ymaps.Map('map-two', {
      center: [55.0438, 82.9386],
      zoom: 14,
      controls: [],
    });

    map.behaviors.disable('scrollZoom');

    // Кастомный масштаб
    const myZoomLayout = ymaps.templateLayoutFactory.createClass(`
      <div class="scale">
        <button class="zoom zoom--in" type="button">+</button>
        <button class="zoom zoom--out" type="button">=</button>
      </div>`, {

      build() {

        myZoomLayout.superclass.build.call(this);
        let zoomInBtn = this.getParentElement().querySelector('.zoom--in');
        let zoomOutBtn = this.getParentElement().querySelector('.zoom--out');

        zoomInBtn.addEventListener('click', ymaps.util.bind(this.zoomIn, this));
        zoomOutBtn.addEventListener('click', ymaps.util.bind(this.zoomOut, this));
      },

      zoomIn() {
        let currentMap = this.getData().control.getMap();
        this.events.fire('zoomchange', {
          oldZoom: currentMap.getZoom(),
          newZoom: currentMap.getZoom() + 1,
        });
      },

      zoomOut() {
        let currentMap = this.getData().control.getMap();
        this.events.fire('zoomchange', {
          oldZoom: currentMap.getZoom(),
          newZoom: currentMap.getZoom() - 1,
        });
      },
    });

    const zoomControl = new ymaps.control.ZoomControl({
      options: {
        name: 'ZoomControl',
        layout: myZoomLayout,
        position: {bottom: '40px', right: '40px'}
      }
    });

    map.controls.add(zoomControl);
    //-- Кастомный масштаб

    //  Кастомный балун

    var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
      `<div class="placemark" data-placemark tabindex="0" data-map-marker="$[properties.category]">
        <div class="placemark__inner">
          <div class="placemark__icon">
            <svg width="40" height="40" aria-hidden="true">
              <use xlink:href="#$[properties.icon]"></use>
            </svg>
          </div>
        </div>
      </div>`
    );

    const MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="placemark-balloon">$[[options.contentLayout]]</div>', {
        build() {
          MyBalloonLayout.superclass.build.call(this);
          const balloon = this.getParentElement().querySelector('.placemark-balloon');
          const closeBtn = balloon.querySelector('.placemark-balloon__close-btn');
          closeBtn.addEventListener('click', () => {
            map.balloon.close();
          });
        },
      }
    );

    const MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        `<div class="placemark-balloon__inner">
          <div class="placemark-balloon__img">
            <img src="$[properties.imgPath]" width="100" height="100" alt="$[properties.imgAlt]">
          </div>
          <div class="placemark-balloon__wrap">
          <h3 class="placemark-balloon__title">$[properties.title]</h3>
          <p class="placemark-balloon__text">$[properties.text]</p>
          <a class="placemark-balloon__link" href="$[properties.link]">перейти на сайт</a>
          </div>
          <button class="placemark-balloon__close-btn" type="button">x</button> 
        </div>`
      );

    const renderMarkers = (data) => {
      data.forEach((item) => {
        const marker = new ymaps.Placemark(
          item.latLng,{
            hintContent: item.hintContent,
            icon: item.icon,
            imgPath: item.imgPath,
            imgAlt: item.imgAlt,
            title: item.title,
            text: item.text,
            link:item.link,
            category: item.category,
          },
          {
            iconLayout: 'default#imageWithContent',
            iconImageHref: '',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -40],
            placemarkType: item.type,
            iconContentLayout: MyIconContentLayout,
            balloonLayout: MyBalloonLayout,
            balloonContentLayout: MyBalloonContentLayout,
            hideIconOnBalloonOpen: false,
            balloonOffset: [-220, -140],
          }
        );
        map.geoObjects.add(marker);
      });
    }

    //-- Кастомный балун

    const onSuccess = (data) => {
      const mapMarkers = data.mapMarkers;
      renderMarkers(mapMarkers)
    };

    fetchApi('./data/map-data.json', onSuccess);
  }
};

export {initMapTwo};
