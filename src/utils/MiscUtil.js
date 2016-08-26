import objectAssign from 'object-assign';

export default class MiscUtil {
    // takes in an object mapping strings (as keys) to booleans
    // and returns a space separated string of those keys that map to true
    static generateStringFromSet(classSet) {
        if (typeof classSet === "object") {
            return Object.keys(classSet).reduce((acc, key) => {
                if (classSet[key] === true) {
                    acc.push(key);
                    return acc;
                }
                return acc;
            }, []).join(' ');
        } else {
            return "";
        }
    }

    static findObjectInArray(array, key, val) {
        for (let i = 0; i < array.length; ++i) {
            if (array[i][key] === val ||
                (typeof array[i].get === "function" && array[i].get(key) === val)) {
                return array[i];
            }
        }
        return false;
    }

    static findAllMatchingObjectsInArray(array, key, val) {
        return array.filter((element) => {
            return element[key] === val || (typeof element.get === "function" && element.get(key) === val);
        });
    }

    static findObjectWithIndexInArray(array, key, val) {
        for (let i = 0; i < array.length; ++i) {
            if (array[i][key] === val ||
                (typeof array[i].get === "function" && array[i].get(key) === val)) {
                return {
                    value: array[i],
                    index: i
                };
            }
        }
        return false;
    }

    static getImmutableObjectSort(field) {
        return (objA, objB) => {
            let fieldA = objA.get(field);
            let fieldB = objB.get(field);

            if (fieldA > fieldB) {
                return 1;
            }
            if (fieldA < fieldB) {
                return -1;
            }
            return 0;
        };
    }

    static getHexFromColorString(colorStr) {
        let rgbExp = /[0-9]{1,3}(,|, | )[0-9]{1,3}(,|, | )[0-9]{1,3}/;
        let hexExp = /[0-9A-Fa-f]{6}/;

        if (rgbExp.test(colorStr)) {
            return this.convertRgbToHex(colorStr);
        } else if (hexExp.test(colorStr)) {
            return this.formatHex(colorStr);
        }
        return "";
    }

    static convertRgbToHex(colorStr) {
        let rgbExp = /[0-9]{1,3}/g;
        let rgbParts = colorStr.match(rgbExp);

        if (rgbParts && rgbParts.length >= 3) {
            // Parse string array to int array
            let rgbPartsInt = rgbParts.map(x => parseInt(x, 10));

            // Validate rgb components are [0-255]
            if (rgbPartsInt.some(x => x < 0 && x > 255)) {
                return "";
            }
            let hexStr = ("0" + rgbPartsInt[0].toString(16)).slice(-2) +
                ("0" + rgbPartsInt[1].toString(16)).slice(-2) +
                ("0" + rgbPartsInt[2].toString(16)).slice(-2);
            return this.formatHex(hexStr);
        }
        return "";
    }

    static formatHex(colorStr) {
        let hexExp = /[0-9A-Fa-f]{6}/;
        let hexParts = colorStr.match(hexExp);

        if (hexParts) {
            return "#" + hexParts[0].toUpperCase();
        }
        return "";
    }

    static enterFullScreen() {
        let element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    static exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    static getIsInFullScreenMode() {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    }

    static objectToUrlParams(params) {
        let arr = params.reduce((acc, el, i) => {
            acc.push(i + "=" + el);
            return acc;
        }, []);
        return arr.join("&");
    }

    static parseUrlHashString(urlStr) {
        return urlStr.replace(/^#\/?|\/$/g, '').split('&').reduce((acc, param) => {
            let paramParts = param.split('=');
            if (paramParts && paramParts.length === 2 && paramParts[0] !== "" && paramParts[1] !== "") {
                acc.push({ key: paramParts[0], value: paramParts[1] });
            }
            return acc;
        }, []);
    }

    static getUrlParams() {
        return this.parseUrlHashString(location.hash);
    }

    static urlIsCrossorigin(url) {
        let a = document.createElement('a');

        // copy window location into the anchor to get consistent results
        // when the port is default for the protocol (e.g. 80 for HTTP)
        a.href = window.location.href;

        // host includes both hostname and port if the port is not standard
        let host = a.host;
        let protocol = a.protocol;

        a.href = url;
        a.href = a.href; // IE only absolutizes href on get, not set

        return protocol !== a.protocol || host !== a.host;
    }

    static openLinkInNewTab(url) {
        window.open(url, "_blank");
    }

    static mailTo(address) {
        window.location.href = "mailto:" + address;
    }
}
