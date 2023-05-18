const initMapOne = () => {
  const mapOne = document.querySelector('#map-one');

  if (!mapOne) {
    return;
  }

  ymaps.ready(init);

  function init() {

    const map = new ymaps.Map('map-one', {
      center: [55.0415, 82.9346],
      zoom: 11,
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
    const zoomControl = new ymaps.control.ZoomControl({options: {name: 'ZoomControl', layout: myZoomLayout, position: {bottom: '40px', right: '40px'}}});

    map.controls.add(zoomControl);

    map.geoObjects.add(
        new ymaps.Placemark([55.0515, 82.9346], {
          hintContent: 'Кастомный pin',
        },
        {
          iconLayout: 'default#image',
          iconImageHref: 'img/svg/map-pin.svg',
          iconImageSize: [40, 40],
          iconImageOffset: [-20, -40],
        })
    );
  }
};

export {initMapOne};
