webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nhtml{\n   \n}\n\nbody{\n    float: left;\n    position: relative;\n    background: url(" + __webpack_require__(20) + ") no-repeat;\n    background-size: 100% auto;\n    overflow: hidden;\n}\n\n.mainBody{\n    width: 100%;\n}\n\n.UFO img, .movingUFO img{\n    width: 100%;\n}\n\n.UFO{\n    position: absolute;\n    width: 1%;\n    top: -27%;\n    left: -36%;\n    transition: width 2.5s;\n}\n\n.movingUFO{\n    position: absolute;\n    width: 18%;\n    top: 10%;\n    left: 9%;\n    transition: width 2s, top 3s;\n    z-index: 1000;\n}\n\n\n.spaceStation{\n    position: relative;\n    width: 100%;\n    margin-top: 10%;\n    /*margin-left: */\n}\n\n.spaceStation img.space{\n    width: 90%;\n    margin-left: 5%;\n}\n\n.redRock{\n    position: absolute;\n    width: 100%;\n    top: 67%;\n    opacity: 0.1;\n}\n\n.redRock img{\n    position: absolute;\n    width: 72%;\n    top: 20%;\n    left: 14%;\n}\n\nimg.astronaut{\n    position: absolute;\n    width: 20%;\n    top: 89%;\n    left: 46%;\n}\n\n\n.btnWrapper{\n    position: relative;\n    width: 50%;\n    height: 40vw;\n    margin-left: 25%;\n    margin-top: 35%;\n}\n\n.btnWrapper img.order{\n    position: absolute;\n    width: 20%;\n}\n\n.right{\n    margin-top: 31%;\n    margin-left: 83%;\n}\n\n.left{\n    margin-left: -1%;\n    margin-top: 31%;\n}\n\n.top{\n    margin-left: 40%;\n    margin-top: 3%;\n}\n\n.buttom{\n    margin-left: 40%;\n    margin-top: 70%;\n}\n\n.playBtn{\n    position: relative;\n}\n.btnWrapper img.btn{\n    width: 55%;\n    position: absolute;\n    margin-top: 26%;\n    left: 22%;\n}\n\n.btnWrapper img.smallBtn{\n    position: absolute;\n    width: 46%;\n    margin-top: 24%;\n    left: 26%;\n}\n\n.btnWrapper img.pressSmallBtn{\n    position: absolute;\n    width: 43%;\n    margin-top: 27%;\n    left: 27%;\n}\n\n\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "3b63820e42874c2f53229c8e02c812b4.png";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "e5c881c8206ecd9e60cda77a2d53ed48.png";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "3551d17637b976579056a1407067cc53.png";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "ca9d6541de09f60b7139db63857664bf.png";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "e70a9d2f3613b8c531587e099904eaf5.png";

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_playing_css__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_playing_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_playing_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_shine_0_png__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_shine_0_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__img_shine_0_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__img_shine_1_png__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__img_shine_1_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__img_shine_1_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__img_shine_2_png__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__img_shine_2_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__img_shine_2_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_shine_3_png__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_shine_3_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__img_shine_3_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__img_shine_4_png__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__img_shine_4_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__img_shine_4_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Ajax_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Ajax_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__Ajax_js__);









var UFO = document.querySelector('.UFO');
var order = document.querySelectorAll('.order');
var redRock = document.querySelector('.redRock');
var playBtn = document.querySelector('.smallBtn');
var spaceImg = document.querySelector('.space');
var redRockImg = redRock.querySelector('img');
var clickNUm = 0;

localStorage.setItem('clickNUm', clickNUm);
console.log(localStorage.clickNUm);

playBtn.addEventListener('touchstart', function() {
    playBtn.className = 'pressSmallBtn';
    order[0].style.marginLeft = '77%';
    order[1].style.marginLeft = '5%';
    order[2].style.marginTop = '7%';
    order[3].style.marginTop = '65%';
    setTimeout(function() {
        playBtn.className = 'smallBtn';
        order[0].style.marginLeft = '83%';
        order[1].style.marginLeft = '-1%';
        order[2].style.marginTop = '3%';
        order[3].style.marginTop = '70%';
    }, 30)
}, false)

setTimeout(function() {
    UFO.className = 'movingUFO';
    UFO.style.top = '10%';
}, 500);

setInterval(function() {
    if (UFO.style.top === '10%') {
        UFO.style.top = '18%';
    } else if (UFO.style.top === '18%') {
        UFO.style.top = '10%';
    }
}, 1000);


var clickSpeed = 0;

playBtn.addEventListener('touchstart', function() {
    if (clickSpeed < 100) {
        clickSpeed += 5;
    }
    if (clickSpeed > 100) {
        clickSpeed = 100;
    }
    if (clickSpeed > 30 && clickSpeed < 50) {
        redRockImg.src = __WEBPACK_IMPORTED_MODULE_2__img_shine_1_png___default.a;
    }
    if (clickSpeed >= 50 && clickSpeed < 80) {
        redRockImg.src = __WEBPACK_IMPORTED_MODULE_4__img_shine_3_png___default.a;
    }
    if (clickSpeed > 80) {
        redRockImg.src = __WEBPACK_IMPORTED_MODULE_5__img_shine_4_png___default.a;
    }
    redRock.style.opacity = clickSpeed / 100;
}, false);

setInterval(function() {
    redRock.style.opacity -= 0.1;
    clickSpeed -= 3;
    if (redRock.style.opacity < 0.1) {
        redRock.style.opacity = 0.1;
    }
    if (clickSpeed < 0) {
        clickSpeed = 0;
    }
    if (clickSpeed > 30 && clickSpeed < 50) {
        redRockImg.src = __WEBPACK_IMPORTED_MODULE_2__img_shine_1_png___default.a;
    }
    if (clickSpeed >= 50 && clickSpeed < 80) {
        redRockImg.src = __WEBPACK_IMPORTED_MODULE_4__img_shine_3_png___default.a;
    }
    if (clickSpeed > 80) {
        redRockImg.src = __WEBPACK_IMPORTED_MODULE_5__img_shine_4_png___default.a;
    }
    if (clickSpeed <= 30) {
        redRockImg.src = __WEBPACK_IMPORTED_MODULE_1__img_shine_0_png___default.a;
    }
}, 200);


playBtn.addEventListener('touchstart', clickSend, false);

var url = 'http://wx.yyeke.com/171215game/user/click' + window.location.search;

var ten = 0;

function clickSend() {
    ten++;
    if (ten >= 10) {
        send();
        ten = 0;
    }
}

function send() {
    clickNUm += 10;
    
    localStorage.setItem('clickNUm', clickNUm);
    __WEBPACK_IMPORTED_MODULE_6__Ajax_js___default()({
        url: url,
        method: "GET",
        success: function(data) {
            console.log(data);
            var dataObj = JSON.parse(data);
            if (dataObj.status == 400) {
                clickNUm += Math.random() * 10;
                //localStorage.setItem('clickNUm', clickNUm);
                window.location.href = '../view/end.html' + window.location.search;
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

// setInterval(function () {
//     window.scrollTo(0,document.body.scrollHeight);
// }, 1);





//The end

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(5, function() {
			var newContent = __webpack_require__(5);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "a4ae9ac99bef51cdfa2e860dbbe74c12.png";

/***/ })
],[18]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY3NzL3BsYXlpbmcuY3NzIiwid2VicGFjazovLy8uL3NyYy9pbWcvc2hpbmVfMC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9zaGluZV8xLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL3NoaW5lXzIucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvc2hpbmVfMy5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9zaGluZV80LnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvcGxheWluZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY3NzL3BsYXlpbmcuY3NzPzNmNTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9wbGF5aW5nQmFja2dyb3VuZC5wbmciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTs7O0FBR0E7QUFDQSw0QkFBNkIsZ0JBQWdCLGlCQUFpQiw2QkFBNkIsR0FBRyxTQUFTLFFBQVEsU0FBUyxrQkFBa0IseUJBQXlCLGlFQUFpRixpQ0FBaUMsdUJBQXVCLEdBQUcsY0FBYyxrQkFBa0IsR0FBRyw2QkFBNkIsa0JBQWtCLEdBQUcsU0FBUyx5QkFBeUIsZ0JBQWdCLGdCQUFnQixpQkFBaUIsNkJBQTZCLEdBQUcsZUFBZSx5QkFBeUIsaUJBQWlCLGVBQWUsZUFBZSxtQ0FBbUMsb0JBQW9CLEdBQUcsb0JBQW9CLHlCQUF5QixrQkFBa0Isc0JBQXNCLDBCQUEwQiw0QkFBNEIsaUJBQWlCLHNCQUFzQixHQUFHLGFBQWEseUJBQXlCLGtCQUFrQixlQUFlLG1CQUFtQixHQUFHLGlCQUFpQix5QkFBeUIsaUJBQWlCLGVBQWUsZ0JBQWdCLEdBQUcsa0JBQWtCLHlCQUF5QixpQkFBaUIsZUFBZSxnQkFBZ0IsR0FBRyxrQkFBa0IseUJBQXlCLGlCQUFpQixtQkFBbUIsdUJBQXVCLHNCQUFzQixHQUFHLDBCQUEwQix5QkFBeUIsaUJBQWlCLEdBQUcsV0FBVyxzQkFBc0IsdUJBQXVCLEdBQUcsVUFBVSx1QkFBdUIsc0JBQXNCLEdBQUcsU0FBUyx1QkFBdUIscUJBQXFCLEdBQUcsWUFBWSx1QkFBdUIsc0JBQXNCLEdBQUcsYUFBYSx5QkFBeUIsR0FBRyxzQkFBc0IsaUJBQWlCLHlCQUF5QixzQkFBc0IsZ0JBQWdCLEdBQUcsNkJBQTZCLHlCQUF5QixpQkFBaUIsc0JBQXNCLGdCQUFnQixHQUFHLGtDQUFrQyx5QkFBeUIsaUJBQWlCLHNCQUFzQixnQkFBZ0IsR0FBRzs7QUFFMzNEOzs7Ozs7O0FDUEEsZ0Y7Ozs7OztBQ0FBLGdGOzs7Ozs7QUNBQSxnRjs7Ozs7O0FDQUEsZ0Y7Ozs7OztBQ0FBLGdGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLElBQUk7Ozs7OztBQU1KLFM7Ozs7OztBQzFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQSxnRiIsImZpbGUiOiJqcy9wbGF5LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIioge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbmh0bWx7XFxuICAgXFxufVxcblxcbmJvZHl7XFxuICAgIGZsb2F0OiBsZWZ0O1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGJhY2tncm91bmQ6IHVybChcIiArIHJlcXVpcmUoXCIuLi9pbWcvcGxheWluZ0JhY2tncm91bmQucG5nXCIpICsgXCIpIG5vLXJlcGVhdDtcXG4gICAgYmFja2dyb3VuZC1zaXplOiAxMDAlIGF1dG87XFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5tYWluQm9keXtcXG4gICAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5VRk8gaW1nLCAubW92aW5nVUZPIGltZ3tcXG4gICAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5VRk97XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDElO1xcbiAgICB0b3A6IC0yNyU7XFxuICAgIGxlZnQ6IC0zNiU7XFxuICAgIHRyYW5zaXRpb246IHdpZHRoIDIuNXM7XFxufVxcblxcbi5tb3ZpbmdVRk97XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDE4JTtcXG4gICAgdG9wOiAxMCU7XFxuICAgIGxlZnQ6IDklO1xcbiAgICB0cmFuc2l0aW9uOiB3aWR0aCAycywgdG9wIDNzO1xcbiAgICB6LWluZGV4OiAxMDAwO1xcbn1cXG5cXG5cXG4uc3BhY2VTdGF0aW9ue1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBtYXJnaW4tdG9wOiAxMCU7XFxuICAgIC8qbWFyZ2luLWxlZnQ6ICovXFxufVxcblxcbi5zcGFjZVN0YXRpb24gaW1nLnNwYWNle1xcbiAgICB3aWR0aDogOTAlO1xcbiAgICBtYXJnaW4tbGVmdDogNSU7XFxufVxcblxcbi5yZWRSb2Nre1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICB0b3A6IDY3JTtcXG4gICAgb3BhY2l0eTogMC4xO1xcbn1cXG5cXG4ucmVkUm9jayBpbWd7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDcyJTtcXG4gICAgdG9wOiAyMCU7XFxuICAgIGxlZnQ6IDE0JTtcXG59XFxuXFxuaW1nLmFzdHJvbmF1dHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB3aWR0aDogMjAlO1xcbiAgICB0b3A6IDg5JTtcXG4gICAgbGVmdDogNDYlO1xcbn1cXG5cXG5cXG4uYnRuV3JhcHBlcntcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB3aWR0aDogNTAlO1xcbiAgICBoZWlnaHQ6IDQwdnc7XFxuICAgIG1hcmdpbi1sZWZ0OiAyNSU7XFxuICAgIG1hcmdpbi10b3A6IDM1JTtcXG59XFxuXFxuLmJ0bldyYXBwZXIgaW1nLm9yZGVye1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHdpZHRoOiAyMCU7XFxufVxcblxcbi5yaWdodHtcXG4gICAgbWFyZ2luLXRvcDogMzElO1xcbiAgICBtYXJnaW4tbGVmdDogODMlO1xcbn1cXG5cXG4ubGVmdHtcXG4gICAgbWFyZ2luLWxlZnQ6IC0xJTtcXG4gICAgbWFyZ2luLXRvcDogMzElO1xcbn1cXG5cXG4udG9we1xcbiAgICBtYXJnaW4tbGVmdDogNDAlO1xcbiAgICBtYXJnaW4tdG9wOiAzJTtcXG59XFxuXFxuLmJ1dHRvbXtcXG4gICAgbWFyZ2luLWxlZnQ6IDQwJTtcXG4gICAgbWFyZ2luLXRvcDogNzAlO1xcbn1cXG5cXG4ucGxheUJ0bntcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG4uYnRuV3JhcHBlciBpbWcuYnRue1xcbiAgICB3aWR0aDogNTUlO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIG1hcmdpbi10b3A6IDI2JTtcXG4gICAgbGVmdDogMjIlO1xcbn1cXG5cXG4uYnRuV3JhcHBlciBpbWcuc21hbGxCdG57XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDQ2JTtcXG4gICAgbWFyZ2luLXRvcDogMjQlO1xcbiAgICBsZWZ0OiAyNiU7XFxufVxcblxcbi5idG5XcmFwcGVyIGltZy5wcmVzc1NtYWxsQnRue1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHdpZHRoOiA0MyU7XFxuICAgIG1hcmdpbi10b3A6IDI3JTtcXG4gICAgbGVmdDogMjclO1xcbn1cXG5cXG5cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyIS4vc3JjL2Nzcy9wbGF5aW5nLmNzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIzYjYzODIwZTQyODc0YzJmNTMyMjljOGUwMmM4MTJiNC5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvc2hpbmVfMC5wbmdcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJlNWM4ODFjODIwNmVjZDllNjBjZGE3N2EyZDUzZWQ0OC5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvc2hpbmVfMS5wbmdcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIzNTUxZDE3NjM3Yjk3NjU3OTA1NmExNDA3MDY3Y2M1My5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvc2hpbmVfMi5wbmdcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJjYTlkNjU0MWRlMDlmNjBiNzEzOWRiNjM4NTc2NjRiZi5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvc2hpbmVfMy5wbmdcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJlNzBhOWQyZjM2MTNiOGM1MzE1ODdlMDk5OTA0ZWFmNS5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvc2hpbmVfNC5wbmdcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiaW1wb3J0ICcuLi9jc3MvcGxheWluZy5jc3MnO1xuaW1wb3J0IHNoaW5lXzAgZnJvbSAnLi4vaW1nL3NoaW5lXzAucG5nJztcbmltcG9ydCBzaGluZV8xIGZyb20gJy4uL2ltZy9zaGluZV8xLnBuZyc7XG5pbXBvcnQgc2hpbmVfMiBmcm9tICcuLi9pbWcvc2hpbmVfMi5wbmcnO1xuaW1wb3J0IHNoaW5lXzMgZnJvbSAnLi4vaW1nL3NoaW5lXzMucG5nJztcbmltcG9ydCBzaGluZV80IGZyb20gJy4uL2ltZy9zaGluZV80LnBuZyc7XG5cbmltcG9ydCBhamF4IGZyb20gJy4vQWpheC5qcyc7XG5cbnZhciBVRk8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuVUZPJyk7XG52YXIgb3JkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub3JkZXInKTtcbnZhciByZWRSb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlZFJvY2snKTtcbnZhciBwbGF5QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNtYWxsQnRuJyk7XG52YXIgc3BhY2VJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3BhY2UnKTtcbnZhciByZWRSb2NrSW1nID0gcmVkUm9jay5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbnZhciBjbGlja05VbSA9IDA7XG5cbmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjbGlja05VbScsIGNsaWNrTlVtKTtcbmNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5jbGlja05VbSk7XG5cbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgIHBsYXlCdG4uY2xhc3NOYW1lID0gJ3ByZXNzU21hbGxCdG4nO1xuICAgIG9yZGVyWzBdLnN0eWxlLm1hcmdpbkxlZnQgPSAnNzclJztcbiAgICBvcmRlclsxXS5zdHlsZS5tYXJnaW5MZWZ0ID0gJzUlJztcbiAgICBvcmRlclsyXS5zdHlsZS5tYXJnaW5Ub3AgPSAnNyUnO1xuICAgIG9yZGVyWzNdLnN0eWxlLm1hcmdpblRvcCA9ICc2NSUnO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBsYXlCdG4uY2xhc3NOYW1lID0gJ3NtYWxsQnRuJztcbiAgICAgICAgb3JkZXJbMF0uc3R5bGUubWFyZ2luTGVmdCA9ICc4MyUnO1xuICAgICAgICBvcmRlclsxXS5zdHlsZS5tYXJnaW5MZWZ0ID0gJy0xJSc7XG4gICAgICAgIG9yZGVyWzJdLnN0eWxlLm1hcmdpblRvcCA9ICczJSc7XG4gICAgICAgIG9yZGVyWzNdLnN0eWxlLm1hcmdpblRvcCA9ICc3MCUnO1xuICAgIH0sIDMwKVxufSwgZmFsc2UpXG5cbnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgVUZPLmNsYXNzTmFtZSA9ICdtb3ZpbmdVRk8nO1xuICAgIFVGTy5zdHlsZS50b3AgPSAnMTAlJztcbn0sIDUwMCk7XG5cbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIGlmIChVRk8uc3R5bGUudG9wID09PSAnMTAlJykge1xuICAgICAgICBVRk8uc3R5bGUudG9wID0gJzE4JSc7XG4gICAgfSBlbHNlIGlmIChVRk8uc3R5bGUudG9wID09PSAnMTglJykge1xuICAgICAgICBVRk8uc3R5bGUudG9wID0gJzEwJSc7XG4gICAgfVxufSwgMTAwMCk7XG5cblxudmFyIGNsaWNrU3BlZWQgPSAwO1xuXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoY2xpY2tTcGVlZCA8IDEwMCkge1xuICAgICAgICBjbGlja1NwZWVkICs9IDU7XG4gICAgfVxuICAgIGlmIChjbGlja1NwZWVkID4gMTAwKSB7XG4gICAgICAgIGNsaWNrU3BlZWQgPSAxMDA7XG4gICAgfVxuICAgIGlmIChjbGlja1NwZWVkID4gMzAgJiYgY2xpY2tTcGVlZCA8IDUwKSB7XG4gICAgICAgIHJlZFJvY2tJbWcuc3JjID0gc2hpbmVfMTtcbiAgICB9XG4gICAgaWYgKGNsaWNrU3BlZWQgPj0gNTAgJiYgY2xpY2tTcGVlZCA8IDgwKSB7XG4gICAgICAgIHJlZFJvY2tJbWcuc3JjID0gc2hpbmVfMztcbiAgICB9XG4gICAgaWYgKGNsaWNrU3BlZWQgPiA4MCkge1xuICAgICAgICByZWRSb2NrSW1nLnNyYyA9IHNoaW5lXzQ7XG4gICAgfVxuICAgIHJlZFJvY2suc3R5bGUub3BhY2l0eSA9IGNsaWNrU3BlZWQgLyAxMDA7XG59LCBmYWxzZSk7XG5cbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIHJlZFJvY2suc3R5bGUub3BhY2l0eSAtPSAwLjE7XG4gICAgY2xpY2tTcGVlZCAtPSAzO1xuICAgIGlmIChyZWRSb2NrLnN0eWxlLm9wYWNpdHkgPCAwLjEpIHtcbiAgICAgICAgcmVkUm9jay5zdHlsZS5vcGFjaXR5ID0gMC4xO1xuICAgIH1cbiAgICBpZiAoY2xpY2tTcGVlZCA8IDApIHtcbiAgICAgICAgY2xpY2tTcGVlZCA9IDA7XG4gICAgfVxuICAgIGlmIChjbGlja1NwZWVkID4gMzAgJiYgY2xpY2tTcGVlZCA8IDUwKSB7XG4gICAgICAgIHJlZFJvY2tJbWcuc3JjID0gc2hpbmVfMTtcbiAgICB9XG4gICAgaWYgKGNsaWNrU3BlZWQgPj0gNTAgJiYgY2xpY2tTcGVlZCA8IDgwKSB7XG4gICAgICAgIHJlZFJvY2tJbWcuc3JjID0gc2hpbmVfMztcbiAgICB9XG4gICAgaWYgKGNsaWNrU3BlZWQgPiA4MCkge1xuICAgICAgICByZWRSb2NrSW1nLnNyYyA9IHNoaW5lXzQ7XG4gICAgfVxuICAgIGlmIChjbGlja1NwZWVkIDw9IDMwKSB7XG4gICAgICAgIHJlZFJvY2tJbWcuc3JjID0gc2hpbmVfMDtcbiAgICB9XG59LCAyMDApO1xuXG5cbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGNsaWNrU2VuZCwgZmFsc2UpO1xuXG52YXIgdXJsID0gJ2h0dHA6Ly93eC55eWVrZS5jb20vMTcxMjE1Z2FtZS91c2VyL2NsaWNrJyArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG5cbnZhciB0ZW4gPSAwO1xuXG5mdW5jdGlvbiBjbGlja1NlbmQoKSB7XG4gICAgdGVuKys7XG4gICAgaWYgKHRlbiA+PSAxMCkge1xuICAgICAgICBzZW5kKCk7XG4gICAgICAgIHRlbiA9IDA7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZW5kKCkge1xuICAgIGNsaWNrTlVtICs9IDEwO1xuICAgIFxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjbGlja05VbScsIGNsaWNrTlVtKTtcbiAgICBhamF4KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB2YXIgZGF0YU9iaiA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICBpZiAoZGF0YU9iai5zdGF0dXMgPT0gNDAwKSB7XG4gICAgICAgICAgICAgICAgY2xpY2tOVW0gKz0gTWF0aC5yYW5kb20oKSAqIDEwO1xuICAgICAgICAgICAgICAgIC8vbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NsaWNrTlVtJywgY2xpY2tOVW0pO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL3ZpZXcvZW5kLmh0bWwnICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbi8vICAgICB3aW5kb3cuc2Nyb2xsVG8oMCxkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCk7XG4vLyB9LCAxKTtcblxuXG5cblxuXG4vL1RoZSBlbmRcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9wbGF5aW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9wbGF5aW5nLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9wbGF5aW5nLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9wbGF5aW5nLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3NzL3BsYXlpbmcuY3NzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJhNGFlOWFjOTliZWY1MWNkZmEyZTg2MGRiYmU3NGMxMi5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvcGxheWluZ0JhY2tncm91bmQucG5nXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiXSwic291cmNlUm9vdCI6IiJ9