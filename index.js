const allSections = document.querySelectorAll('section');
const menuButton = document.querySelector('.header__menu-btn-container');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu__item');

const header = document.querySelector('.header');
const menuCheckbox = document.querySelector('.header__checkbox');

const priceTable = document.querySelector('.price__table');
const priceTableHeader = document.querySelector('.table-header');
const priceTableRows = document.querySelectorAll('.price__table-row');
const priceBtnRow = document.querySelector('.price__btn-row');

const priceTableFirstRow = document.querySelector('#price__table-first-row');
const priceTablePriceDesc = document.querySelector('#price__table-price-desc');

let priceTableTop;
let priceTablePriceDescTop;
let maxMarginValue;

const getOffsetRect = (el) => {

    let rect = el.getBoundingClientRect();

    // add window scroll position to get the offset position
    let left = rect.left + window.scrollX;
    let top = rect.top + window.scrollY;
    let right = rect.right + window.scrollX;
    let bottom = rect.bottom + window.scrollY;

    // polyfill missing 'x' and 'y' rect properties not returned
    // from getBoundingClientRect() by older browsers
    let x = rect.x === undefined ? left : rect.x + window.scrollX;
    let y = rect.y === undefined ? top : rect.y + window.scrollY;

    // width and height are the same
    let width = rect.width;
    let height = rect.height;

    return {left, top, right, bottom, x, y, width, height};
};

const scrollSpy = () => {
    const scrollTop = window.scrollY + header.offsetHeight;
    allSections.forEach(section => {
        const id = section.id;
        const offset = getOffsetRect(section).top - 1;
        const height = section.offsetHeight;

        if (scrollTop > offset && scrollTop < offset + height) {
            menuItems.forEach(item => {
                item.classList.remove('menu__item_type_active');
            })
            const menuItemActive = menu.querySelector('[data-scroll="' + id + '"]');
            if (menuItemActive) menuItemActive.classList.add('menu__item_type_active');
        }

    });
}

const handleMenuToggle = (open = true) => {
    // 3TO MY>I< HAPE(I)AKTOPNIL
    const method = open ? 'toggle' : 'remove';
    menuItems.forEach(item => item.classList[method]('menu__item_opened'));
    menu.classList[method]('menu_opened');
    if (!open) menuCheckbox.checked = false;
};

const handlePriceTableHeader = () => {

    if ((window.scrollY + header.offsetHeight) >= priceTableTop) {

        priceTableFirstRow.classList.add('price__table-row_style_margin');

        if ((window.scrollY + header.offsetHeight + priceTableHeader.offsetHeight) >= priceTablePriceDescTop) {
            priceTableHeader.style.top = (priceTablePriceDescTop - priceTableHeader.offsetHeight) + 'px';
            priceTableHeader.style.position = 'absolute';
        } else {
            priceTableHeader.style.top = header.offsetHeight + 'px';
            priceTableHeader.style.position = 'fixed';
        }

    } else {
        priceTableHeader.style.position = 'static';
        priceTableFirstRow.classList.remove('price__table-row_style_margin');
    }
}

const checkWindowSize = () => {
    if (window.innerWidth > 767 && menuCheckbox.checked) {
        handleMenuToggle(false);
    } else {
        maxMarginValue = priceTable.offsetWidth - window.innerWidth;
        priceTableTop = getOffsetRect(priceTable).top;
        priceTablePriceDescTop = getOffsetRect(priceTablePriceDesc).top;
    }
}

document.addEventListener('scroll', scrollSpy);
window.addEventListener('resize', checkWindowSize);

menu.addEventListener('click', () => {
    handleMenuToggle(false)
});
menuButton.addEventListener('click', () => {
    handleMenuToggle()
});

window.addEventListener("load", () => {

    maxMarginValue = priceTable.offsetWidth - window.innerWidth;

    let priceTableRowOffset = 0;

    const rows = [...priceTableRows, priceBtnRow];
    rows.forEach(o => {
        o.style.marginLeft = priceTableRowOffset;
    });

    let touchstartScreenX = 0;

    priceTable.addEventListener('touchstart', e => {
        touchstartScreenX = e.touches[0] || e.changedTouches[0];
    });

    priceTable.addEventListener('touchmove', e => {
        let touch = e.touches[0] || e.changedTouches[0];
        let touchScreenX = touch.screenX;

        priceTableRowOffset = touchScreenX - touchstartScreenX;

        let newMargin = parseInt(rows[0].style.marginLeft) + priceTableRowOffset;
        if (newMargin <= 0 && Math.abs(newMargin) < maxMarginValue) {
            rows.forEach(o => {
                o.style.marginLeft = newMargin + 'px';
            });
        }
        touchstartScreenX = touchScreenX;
    });

    priceTableTop = getOffsetRect(priceTable).top;
    priceTablePriceDescTop = getOffsetRect(priceTablePriceDesc).top;

    document.addEventListener('scroll', handlePriceTableHeader);
});


/**
 * yandexMap
 */
const yandexMapScript = document.createElement('script');
yandexMapScript.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
document.querySelector('head').appendChild(yandexMapScript);

if (yandexMapScript.readyState) {  //IE
    yandexMapScript.onreadystatechange = () => {
        if (yandexMapScript.readyState === "loaded" || yandexMapScript.readyState === "complete") {
            yandexMapScript.onreadystatechange = null;
            ymaps.ready(init);
        }
    };
} else {  //Others
    yandexMapScript.onload = () => {
        ymaps.ready(init);
    };
}

let yandexMap, yandexPlacemark;

const init = () => {
    const coords = [59.958264, 30.313757];


    yandexMap = new ymaps.Map("map__canvas", {
        center: coords,
        zoom: 16,
        controls: [],
        //behaviors: ["scrollZoom"]
    });

    yandexMap.behaviors.disable('drag');
    yandexMap.behaviors.disable("scrollZoom");

    yandexPlacemark = new ymaps.Placemark(coords, {
        hintContent: '■. █■■■■-█■■■■■■■■, ■■-■ █■■■■■■■■■■■■■■■■, 12, ■■■■■ █, ■■■. 2-█, ■■. 58',
    });

    yandexMap.geoObjects.add(yandexPlacemark);
}