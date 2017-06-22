/**
* jQuery scrollTo v0.2.1
* https://github.com/amazingSurge/jquery-scrollTo
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryScrollToEs = mod.exports;
  }
})(this,

  function(_jquery) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    var DEFAULTS = {
      speed: '1000',
      easing: 'linear',
      namespace: 'scrollTo',
      offsetTop: 50,
      mobile: {
        width: 768,
        speed: '500',
        easing: 'linear'
      }
    };

    var NAMESPACE$1 = 'ScrollTo';

    /**
     * Plugin constructor
     **/

    var ScrollTo = function() {
      function ScrollTo(element) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, ScrollTo);

        this.element = element;
        this.$element = (0, _jquery2.default)(element);
        this.$doc = (0, _jquery2.default)('body');
        this.options = _jquery2.default.extend(true, {}, DEFAULTS, options);

        this.namespace = this.options.namespace;

        this.classes = {
          active: this.namespace + '_active',
          animating: this.namespace + '_animating'
        };

        this.useMobile = false;
        this.noroll = false;

        this.init();
      }

      _createClass(ScrollTo, [{
        key: 'init',
        value: function init() {
          var _this = this;

          var that = this;

          this.transition = this.transition();
          this.roll();

          this.$element.on('click.scrollTo',

            function(event) {
              event = event || window.event;
              var target = event.target || event.srcElement;
              that.$target = (0, _jquery2.default)(target);
              that.active(that.$target);

              var href = that.$target.attr('data-scrollto');

              if (href) {
                that.$anchor = (0, _jquery2.default)('#' + href);
                that.$doc.trigger(NAMESPACE$1 + '::jump');
              }

              return false;
            }
          );

          //bind events
          this.$doc.on(NAMESPACE$1 + '::jump',

            function() {
              that.noroll = true;

              that.checkMobile();

              var easing = void 0;
              var speed = void 0;

              if (that.useMobile) {
                speed = that.options.mobile.speed;
                easing = that.options.mobile.easing;
              } else {
                speed = that.options.speed;
                easing = that.options.easing;
              }

              if (that.$anchor && that.$anchor.length > 0) {
                that.$doc.addClass(that.classes.animating);

                var top = that.$anchor.offset().top;

                if (that.transition.supported) {
                  var pos = (0, _jquery2.default)(window).scrollTop();

                  that.$doc.css({
                    'margin-top': -(pos - top) + 'px'
                  });

                  (0, _jquery2.default)(window).scrollTop(top);

                  that.insertRule('.duration_' + speed + '{' + that.transition.prefix + 'transition-duration: ' + speed + 'ms;}');

                  that.$doc.addClass('easing_' + easing + ' duration_' + speed).css({
                    'margin-top': ''
                  }).one(that.transition.end,

                    function() {
                      that.noroll = false;
                      that.$doc.removeClass(that.classes.animating + ' easing_' + easing + ' duration_' + speed);
                    }
                  );
                } else {
                  (0, _jquery2.default)('html, body').animate({
                    scrollTop: that.top
                  }, speed,

                    function() {
                      that.$doc.removeClass(that.classes.animating);
                    }
                  );

                  return;
                }
              } else {

                return;
              }
            }
          );

          (0, _jquery2.default)(window).scroll(

            function() {
              _this.roll();
            }
          );
        }
      }, {
        key: 'checkMobile',
        value: function checkMobile() {
          var width = (0, _jquery2.default)(window).width();

          if (width < this.options.mobile.width) {
            this.useMobile = true;
          } else {
            this.useMobile = false;
          }
        }
      }, {
        key: 'active',
        value: function active($index) {
          if (typeof $index === 'undefined') {

            return;
          }
          this.$element.children().removeClass(this.classes.active);
          $index.addClass(this.classes.active);
        }
      }, {
        key: 'roll',
        value: function roll() {
          var that = this;

          if (this.noroll) {

            return;
          }
          this.$doc.find("[id]").each(

            function() {
              if ((0, _jquery2.default)(window).scrollTop() > (0, _jquery2.default)(this).offset().top - that.options.offsetTop && (0, _jquery2.default)(window).scrollTop() < (0, _jquery2.default)(this).offset().top + (0, _jquery2.default)(this).height()) {
                var anchorHref = (0, _jquery2.default)(this).attr('id');
                var $anchor = that.$element.find('[data-scrollto="' + anchorHref + '"]');
                that.$anchor = (0, _jquery2.default)(this);
                that.active($anchor);
              }
            }
          );
        }
      }, {
        key: 'transition',
        value: function transition() {
          var e = void 0;
          var end = void 0;
          var prefix = '';
          var supported = false;
          var el = document.createElement("fakeelement");

          var transitions = {
            "WebkitTransition": "webkitTransitionEnd",
            "MozTransition": "transitionend",
            "OTransition": "oTransitionend",
            "transition": "transitionend"
          };

          for (e in transitions) {

            if (el.style[e] !== undefined) {
              end = transitions[e];
              supported = true;
              break;
            }
          }

          if (/(WebKit)/i.test(window.navigator.userAgent)) {
            prefix = '-webkit-';
          }

          return {
            prefix: prefix,
            end: end,
            supported: supported
          };
        }
      }, {
        key: 'insertRule',
        value: function insertRule(rule) {
          if (this.rules && this.rules[rule]) {

            return;
          } else if (this.rules === undefined) {
            this.rules = {};
          } else {
            this.rules[rule] = true;
          }

          if (document.styleSheets && document.styleSheets.length) {
            document.styleSheets[0].insertRule(rule, 0);
          } else {
            var style = document.createElement('style');
            style.innerHTML = rule;
            document.head.appendChild(style);
          }
        }
      }, {
        key: 'jump',
        value: function jump() {
          this.$doc.trigger('ScrollTo::jump');
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          this.$trigger.remove();
          this.$element.data('ScrollTo', null);
          this.$element.off('ScrollTo::jump');
        }
      }], [{
        key: 'setDefaults',
        value: function setDefaults(options) {
          _jquery2.default.extend(true, DEFAULTS, _jquery2.default.isPlainObject(options) && options);
        }
      }]);

      return ScrollTo;
    }();

    var info = {
      version: '0.2.1'
    };

    var NAMESPACE = 'scrollTo';
    var OtherScrollTo = _jquery2.default.fn.scrollTo;

    var jQueryScrollTo = function jQueryScrollTo(options) {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (typeof options === 'string') {
        var _ret = function() {
          var method = options;

          if (/^_/.test(method)) {

            return {
              v: false
            };
          } else if (/^(get)/.test(method)) {
            var instance = _this2.first().data(NAMESPACE);

            if (instance && typeof instance[method] === 'function') {

              return {
                v: instance[method].apply(instance, args)
              };
            }
          } else {

            return {
              v: _this2.each(

                function() {
                  var instance = _jquery2.default.data(this, NAMESPACE);

                  if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                  }
                }
              )
            };
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")

          return _ret.v;
      }

      return this.each(

        function() {
          if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
            (0, _jquery2.default)(this).data(NAMESPACE, new ScrollTo(this, options));
          }
        }
      );
    };

    _jquery2.default.fn.scrollTo = jQueryScrollTo;

    _jquery2.default.scrollTo = _jquery2.default.extend({
      setDefaults: ScrollTo.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.scrollTo = OtherScrollTo;

        return jQueryScrollTo;
      }
    }, info);
  }
);